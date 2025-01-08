import { useState, useEffect } from "react";

function App() {
  const [message, setMessage] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [response, setResponse] = useState("");

  // Fetch data from the Go API
  useEffect(() => {
    fetch("/api/message/get")
      .then((res) => res.json())
      .then((data) => setMessage(data.text))
      .catch((err) => console.error(err));
  }, []);

  // Send data to the Go API
  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("/api/message/post", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: newMessage }),
    })
      .then((res) => res.json())
      .then((data) => setResponse(data.text))
      .catch((err) => console.error(err));
  };

  return (
    <div>
      <h1>React-Go API Test</h1>
      <p>Message from Go: {message}</p>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Send a message"
        />
        <button type="submit">Send</button>
      </form>
      {response && <p>Response from Go: {response}</p>}
    </div>
  );
}

export default App;
