import React from "react";
import "./style.css";

//          component: 푸터 레이아웃          //
export default function Footer() {
  //          event handler: 인스타 아이콘 버튼 클릭 이벤트 처리          //
  const onInstaIconButtonClickHandler = () => {
    window.open("https://www.instagram.com");
  };

  //          event handler: 네이버 블로그 아이콘 버튼 클릭 이벤트 처리          //
  const onNaverBlogIconButtonClickHandler = () => {
    window.open("https://blog.naver.com");
  };

  //          render: 푸터 레이아웃 랜더링          //
  return (
    <div className='footer'>
      <div className='footer-container'>
        <div className='footer-top'>
          <div className='footer-logo-box'>
            <div className='icon-box'>
              <div className='icon logo-light-icon'></div>
            </div>
            <div className='footer-logo-text'>{"Thoreausawyer Board"}</div>
          </div>
          <div className='footer-link-box'>
            <div className='footer-email-link'>{"daegumian91@gmail.com"}</div>
            <div
              className='icon-button'
              onClick={onInstaIconButtonClickHandler}
            >
              <div className='icon insta-icon'></div>
            </div>
            <div
              className='icon-button'
              onClick={onNaverBlogIconButtonClickHandler}
            >
              <div className='icon naver-blog-icon'></div>
            </div>
          </div>
        </div>
        <div className='footer-bottom'>
          <div className='footer-copyright'>
            {"Copyright © 2024 Thoreausawyer. All Rights Reserved"}
          </div>
        </div>
      </div>
    </div>
  );
}
