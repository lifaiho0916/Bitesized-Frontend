import React, { useState, useContext } from "react";
import {
  AppleMusicIcon,
  ExpandIcon,
  InstagramIcon,
  LinkedInIcon,
  SpotifyIcon,
  TwitterIcon,
  YoutubeIcon,
} from "../assets/svg";
import { Link } from "react-router-dom";
import { LanguageContext } from "../routes/authRoute";
import "../assets/styles/footerStyle.scss";

const List = (props: any) => {
  const { title, subtitles, contexts } = props;
  const [expand, setExpand] = useState<boolean>(true);
  const handleExpand = () => {
    setExpand(!expand);
  };

  const style = {
    icon: {
      transition: "0.3s",
      transform: expand ? "rotate(180deg)" : "rotate(0deg)",
    },
    content: {
      transition: "0.5s",
      opacity: expand ? "1" : "0",
      visibility: expand ? "visible" : "hidden",
      overflow: "hidden",
      height: expand ? "fit-content" : "0",
      position: expand ? "relative" : "relative",
    },
  };
  return (
    <div className="part">
      <div className="title" onClick={handleExpand}>
        <h3>{title}</h3>
        <div style={style.icon} className="icon">
          <ExpandIcon color="#43403e" />
        </div>
      </div>
      <div className="content" style={style.content as React.CSSProperties}>
        {subtitles.map((subtitle: any, i: number) => {
          if (
            subtitle.text === contexts.FOOTER.TANDC ||
            subtitle.text === contexts.FOOTER.PRIVACY_POLICY
          )
            return <Link key={i} to={subtitle.link}>{subtitle.text}</Link>;
          else
            return (
              <a key={i} href={subtitle.link} target="_blank">
                {subtitle.text}
              </a>
            );
        })}
      </div>
    </div>
  );
};

const Footer = () => {
  const contexts = useContext(LanguageContext);

  return (
    <div className="footer-wrapper">
      <div className="footer-top">
        <List
          title={contexts.FOOTER.ABOUT_CREATO}
          subtitles={[
            {
              text: contexts.FOOTER.OUR_STORY,
              link: "https://www.creatogether.app",
            },
            {
              text: contexts.FOOTER.HOW_IT_WORKS,
              link: "https://www.creatogether.app/how-it-works",
            },
          ]}
          contexts={contexts}
        />
        <List
          title={contexts.FOOTER.SUPPORT}
          subtitles={[
            {
              text: contexts.FOOTER.FAQ,
              link: "https://www.creatogether.app/faq",
            },
            {
              text: contexts.FOOTER.TANDC,
              link: `/terms`,
            },
            {
              text: contexts.FOOTER.PRIVACY_POLICY,
              link: `/privacy-policy`,
            },
          ]}
          contexts={contexts}
        />
        <List
          title={contexts.FOOTER.DISCOVER}
          subtitles={[
            {
              text: contexts.FOOTER.CONTACT_US,
              link: "https://www.creatogether.app/contact-us",
            },
            {
              text: contexts.FOOTER.BLOG,
              link: "https://www.creatogether.app/blogs",
            },
          ]}
          contexts={contexts}
        />
      </div>
      <div className="footer-bottom">
        <div className="social-links">
          <div className="icon">
            <a
              href="https://www.instagram.com/creatogether.app"
              target="_blank"
            >
              <InstagramIcon color="black" />
            </a>
          </div>
          <div className="icon">
            <a href="https://twitter.com/creatogether_" target="_blank">
              <TwitterIcon color="black" />
            </a>
          </div>
          <div className="icon">
            <a href="https://www.youtube.com/creatopodcast" target="_blank">
              <YoutubeIcon color="black" />
            </a>
          </div>
          <div className="icon">
            <a
              href="https://www.linkedin.com/company/creatogether"
              target="_blank"
            >
              <LinkedInIcon color="black" />
            </a>
          </div>
          <div className="icon">
            <a href="https://apple.co/32BG7d3" target="_blank">
              <AppleMusicIcon color="black" />
            </a>
          </div>
          <div className="icon">
            <a href="https://spoti.fi/3o5HeJA" target="_blank">
              <SpotifyIcon color="black" />
            </a>
          </div>
        </div>
        <h3>C R E A T O</h3>
        <h5>BETA</h5>
        <br/>
        <p>©2022-2023, ESSAA Limited {contexts.FOOTER.ALL_RESERVED}</p>
      </div>
    </div>
  );
};

export default Footer;
