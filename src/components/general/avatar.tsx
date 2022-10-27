import React from "react"
import { useState } from "react"
import visitorImg from "../../assets/img/visitor_avatar.png"

const Avatar = (props: any) => {
  const { size, avatarStyle, category, username, avatar, handleClick, hover } = props
  const [status, setStatus] = useState("default");
  let imgSize = size === "small" ? "34px" : size === "mobile" ? "70px" : size === "web" ? "120px" : "34px";

  const myStyle = {
    cursor: 'pointer',
    display: "flex",
    position: "relative",
    flexDirection: avatarStyle === "horizontal" ? "row" : "column",
    alignItems: "center",
  };

  const myStyle1 = {
    opacity: hover ? status === "hover" && size === "mobile" ? "0" : "1" : "1",
    transition: "0.3s",
  };

  const imgStyle = {
    width: imgSize,
    height: imgSize,
    borderRadius: "100%",
    border: status === "hover" ? "2px solid #EFA058" : "2px solid rgba(0,0,0,0)",
    position: "relative" as const,
    cursor: "pointer",
    transition: "0.3s",
    overflow: "hidden",
  };

  const image = {
    objectFit: "contain",
    height: '100%',
  };

  const nameStyle = {
    textAlign: avatarStyle === "horizontal" ? "left" : "center",
    padding: "0",
    margin: "0px 5px",
    fontSize: size === "small" ? "12px" : "16px",
    fontWeight: "bold",
    color: hover && status === "hover" ? '#EFA058' : 'black',
    display: avatarStyle === "noname" ? "none" : "block",
    
  };

  const cartegoryStyle = {
    padding: "0",
    margin: "0px 5px",
    fontSize: "12px",
    display: category === (undefined || "") ? "none" : "block",
    textAlign: "center" as const,
  }

  const Style = {
    display: "flex",
    flexDirection: "column" as const,
    justifyContent: "center",
    position: "relative" as const,
  };
  return (
    <div
      style={myStyle as React.CSSProperties}
      onMouseOver={() => setStatus("hover")}
      onMouseLeave={() => setStatus("default")}
      onClick={handleClick}
    >
      <div style={Style}>
        <div style={imgStyle}>
          <img src={avatar !== "" ? avatar : visitorImg} alt="avatar" style={image as React.CSSProperties} />
        </div>
      </div>
      <div style={myStyle1 as React.CSSProperties}>
        <p style={nameStyle as React.CSSProperties}>{username}</p>
        <span style={cartegoryStyle}>{category}</span>
      </div>
    </div>
  )
}

export default Avatar;
