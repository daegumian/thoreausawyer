import React, { ChangeEvent, useRef, useState, KeyboardEvent, useEffect } from "react";
import "./style.css";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { AUTH_PATH, BOARD_DETAIL_PATH, BOARD_PATH, BOARD_UPDATE_PATH, BOARD_WRITE_PATH, MAIN_PATH, SEARCH_PATH, USER_PATH } from "constant";
import { useCookies } from "react-cookie";
import { useBoardStore, userLoginUserStore } from "stores";

//          component: 헤더 레이아웃         //
export default function Header() {

  
  
  //          state: 로그인 유저 상태         //
  const {loginUser, setLoginUser, resetLoginUser} = userLoginUserStore();
  //          state: path 상태         //
  const {pathname} = useLocation();
  //          state: cookie 상태         //
  const [cookies, setCookie] = useCookies();
  //          state: 로그인 상태          //
  const [isLogin, setLogin] = useState<boolean>(false);

  const isAuthPage = pathname.startsWith(AUTH_PATH());
  const isMainPage = pathname === MAIN_PATH();
  const isSearchPage = pathname.startsWith(SEARCH_PATH(''));
  const isBoardDetailPage = pathname.startsWith(BOARD_PATH() + "/" + BOARD_DETAIL_PATH(''));
  const isBoardWritePage = pathname.startsWith(BOARD_PATH() + "/" + BOARD_WRITE_PATH());
  const isBoardUpdatePage = pathname.startsWith(BOARD_PATH() + "/" + BOARD_UPDATE_PATH(''));
  const isUserPage = pathname.startsWith(USER_PATH(''));


  //          function:  네비게이트 함수          //
  const navigate = useNavigate();

  //         event handler: 로고 클릭 이벤트 처리 함수         //
  const onLogoClickHandler = () =>{
    navigate(MAIN_PATH());
  }

  //          component: 검색 버튼 컴포넌트           //
  const SearchButton = () =>{
    
    //         state: 검색어 버튼 요소 참조 상태           //
    const searchButtonRef = useRef<HTMLDivElement|null>(null);
    //         state: 검색 버튼 상태           //
    const[status, setStatus] = useState<boolean>(false);
    //         state: 검색어 버튼 상태           //
    const[word, setWord] = useState<string>('');    
    //         state: 검색어 path variable 상태           //
    const { searchWord } = useParams();
    //         event handler: 검색어 변경 이벤트 처리 함수        //
    const onSearchWordChangeHandler = (event: ChangeEvent<HTMLInputElement>)=>{
      const value = event.target.value;
      setWord(value);
    }
    //         event handler: 검색어 키 이벤트 처리 함수        //
    const onSearchWordKeyDownHandler = (event:KeyboardEvent<HTMLInputElement>) =>{
      if(event.key !== 'Enter') return;
      if(!searchButtonRef.current) return;
      searchButtonRef.current.click();
    }

    //         event handler: 검색 버튼 클릭 이벤트 처리 함수        //
    const onSearchButtonClickHandler = () => {
      if(!status){
        setStatus(!status);
        return
      }
      navigate(SEARCH_PATH(word));
    }

    //          effect: 검색어 path variable 변경 될 때 마다 실행될 함수        //
    useEffect(() =>{
      if(searchWord){
        setWord(searchWord);
        setStatus(true);
      }
    },[searchWord])

    if (!status)
    //          render: 검색 버튼 컴포넌트 런대링 (클릭 false 상태)          //
    return (
    <div className="icon-button" onClick={onSearchButtonClickHandler}>
      <div className="icon search-light-icon"></div>
    </div>
    )
    //          render: 검색 버튼 컴포넌트 렌더링링 (클릭 true 상태)          //
    return(
      <div className="header-search-input-box">
        <input className="header-search-input" type="text" placeholder='검색어를 입력해주세요.' value={word} onChange={onSearchWordChangeHandler} onKeyDown={onSearchWordKeyDownHandler}/>
        <div ref={searchButtonRef} className="icon-button" onClick={onSearchButtonClickHandler}>
          <div className="icon search-light-icon"></div>
        </div>
      </div>
    );

  }

  //          component: 로그인 또는 마이페이지 버튼 컴포넌트           //
  const MyPageButton = () => {

    //          state: userEmail path variable 상태         //
    const {userEmail}= useParams();
    //          event handler: 마이페이지 버튼 클릭 이벤트 처리 함수          //
    const onMyPageButtonClickHandler = () => {
      if(!loginUser) return;
      const{email} = loginUser;
      navigate(USER_PATH(email));
    }
    //          event handler: 로그인 버튼 클릭 이벤트 처리 함수          //
    const onSingInButtonClickHandler =()=>{
      navigate(AUTH_PATH());
    }
    //          event handler: 로그아웃 버튼 클릭 이벤트 처리 함수          //
    const onSignOutButtonClickHandler = () => {
      resetLoginUser();
      navigate(MAIN_PATH());
    }
    //          render: 로그아웃 버튼 컴포넌트 렌더링        //
    if(isLogin && userEmail === loginUser?.email )
    return <div className="white-button" onClick={onSignOutButtonClickHandler}>{'로그아웃'}</div>
    //          render: 마이페이지 버튼 컴포넌트 렌더링        //
    if(isLogin)
    return <div className="white-button" onClick={onMyPageButtonClickHandler}>{'마이페이지'}</div>
    //          render: 로그인 버튼 컴포넌트 렌더링        //
    return <div className="black-button" onClick={onSingInButtonClickHandler}>{'로그인'}</div>
  }
  
  //          component: 업로드 버튼 컴포넌트           //
  const UploadButton =()=>{

    //          state: 게시물 상태          //
    const{ title, content, boardImageFileList, resetBoard } = useBoardStore();

    //          event handler: 업로드 버튼 클릭 이벤트 처리 함수          //
    const onUploardButtonClickHandler = () =>{

    }

    //          render: 업로드 버튼 컴포넌트 렌더링        //
    if(title&&content)
    return <div className="black-button" onClick={onUploardButtonClickHandler}>{'업로드'}</div>
    //          render: 업로드 불가 컴포넌트 렌더링        //

    return <div className="disable-button" >{'업로드'}</div>

  }




  //          render: 헤더 레이아웃 랜더링        //
  return (
    <div id='header'>
      <div className='header-container'>
        <div className='header-left-box' onClick={onLogoClickHandler}>
          <div className='icon-box'>
            <div className='icon logo-dark-icon'></div>
          </div>
          <div className='header-logo'>{"Thoreausawyer Board"}</div>
        </div>
        <div className='header-right-box'>
          {(isAuthPage || isMainPage ||isSearchPage || isBoardDetailPage) && <SearchButton/>}
          {(isMainPage || isSearchPage || isBoardDetailPage || isUserPage)&& <MyPageButton/>}
          {(isBoardWritePage || isBoardUpdatePage) && <UploadButton/>}
        </div>
      </div>
    </div>
  );
}
