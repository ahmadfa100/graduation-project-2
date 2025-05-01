export function Send({ content, time }) {
  
    if (typeof content === "string") {
      return (
        <div className="send">
          <div className="message">{content}</div>
          <div className="timestamp">{time}</div>
        </div>
      );
    } else if (
      content instanceof ArrayBuffer ||
      content instanceof Uint8Array ||
      content instanceof File
    ) {
      const blob = new Blob([content], { type: "image/png" });
      const imageUrl = URL.createObjectURL(blob);
      return (
        <div className="send">
          <img src={imageUrl} alt="chatImage" />
          <div className="timestamp">{time}</div>
        </div>
      );
    } else {
      return (
        <div className="send">
          <div className="message error-message"> unknown type message❌</div>
          <div className="timestamp">{time}</div>
        </div>
      );
    }
  }
  
  export function Receive({ content, time }) {
    if (typeof content === "string") {
      return (
        <div className="received">
          <div className="message">{content}</div>
          <div className="timestamp">{time}</div>
        </div>
      );
    } else if (content instanceof ArrayBuffer || content instanceof Uint8Array) {
      const blob = new Blob([content], { type: "image/png" });
      const imageUrl = URL.createObjectURL(blob);
      return (
        <div className="received">
          <img src={imageUrl} alt="chatImage" />
          <div className="timestamp">{time}</div>
        </div>
      );
    } else {
      return (
        <div className="received ">
          <div className="message error-message"> unknown type message❌</div>
          <div className="timestamp">{time}</div>
        </div>
      );
    }
  }