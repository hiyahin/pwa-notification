import React, { useEffect } from 'react';
import { VAPID_PUBLIC_KEY } from './secrets';
import './App.css';

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

function App() {
  useEffect(() => {
    Notification.requestPermission();
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault();
    const message = e.target.message.value;
    console.log(message);

    await fetch ("/broadcast", {
      method: "POST",
      body: JSON.stringify({
        message
      }),
      headers: {
          "content-type": "application/json"
      }
    });
  };

  return (
    <div>
      <button onClick={() => {
        navigator.serviceWorker.getRegistration().then(async (reg) => {
            const subscription = await reg.pushManager.subscribe({
              userVisibleOnly: true,
              //public vapid key
              applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
            });

            await fetch("/subscribe", {
              method: "POST",
              body: JSON.stringify(subscription),
              headers: {
                  "content-type": "application/json"
              }
            });
        });
      }}>Subscribe to push</button>
      <form onSubmit={handleSubmit}>
        <input type="text" name="message" />
        <input type="submit" />
      </form>
    </div>
  );
}

export default App;
