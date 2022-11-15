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
      height: expand ? "160px" : "0",
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
            subtitle.text === contexts.FOOTER_LETTER.TERMS_AND_CONDITIONS ||
            subtitle.text === contexts.FOOTER_LETTER.PRIVACY_POLICY
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
          title="About Creato"
          subtitles={[
            {
              text: contexts.FOOTER_LETTER.OUR_STORY,
              link: "https://www.creatogether.app",
            },
            {
              text: contexts.FOOTER_LETTER.HOW_IT_WORKS,
              link: "https://www.creatogether.app/how-it-works",
            },
          ]}
          contexts={contexts}
        />
        <List
          title="Support"
          subtitles={[
            {
              text: contexts.FOOTER_LETTER.FAQ,
              link: "https://www.creatogether.app/faq",
            },
            {
              text: contexts.FOOTER_LETTER.TERMS_AND_CONDITIONS,
              link: `/terms`,
            },
            {
              text: contexts.FOOTER_LETTER.PRIVACY_POLICY,
              link: `/privacy-policy`,
            },
          ]}
          contexts={contexts}
        />
        <List
          title="Discover"
          subtitles={[
            {
              text: contexts.FOOTER_LETTER.CONTACT_US,
              link: "https://www.creatogether.app/contact-us",
            },
            {
              text: contexts.FOOTER_LETTER.BLOG,
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
        <p>©2022, Creato All Rights Reserved.</p>
      </div>
    </div>
  );
};

export default Footer;
