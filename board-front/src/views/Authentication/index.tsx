import React, { useState,KeyboardEvent, useRef, ChangeEvent } from "react";
import "./style.css";
import InputBox from "components/InputBox";
import { SignInRequestDto } from "apis/request/auth";
import { signInRequest } from "apis";
import { SignInResponseDto } from "apis/response/auth";
import { ResponseDto } from "apis/response";
import { useCookies } from "react-cookie";
import { MAIN_PATH } from "constant";
import { useNavigate } from "react-router-dom";

  //          component: 인증 화면 컴포넌트          //
  export default function Authentication() {
    
    //          state: 화면 상태          //
    // 두 가지의 값(상태)만 가질 수 있도록 만들어줌
    const [view, setView] = useState<'sign-up'|'sign-in'>('sign-in');

    //          state: 쿠키 상태          //
    const [cookies, setCookies] = useCookies();

    //          function: 네이게이트 함수         //
    const navigator = useNavigate();
    
    //          component: sign in card 컴포넌트          //
    const SignInCard = () =>{

      //          state: 이메일 요소 참조 상태          //
      const emailRef = useRef<HTMLInputElement | null> (null);
      //          state: 패스워드 요소 참조 상태          //
      const passwordRef = useRef<HTMLInputElement | null> (null);

      
      //          state: 이메일 상태          //
      const [email, setEmail] = useState<string>('');
      //          state: 패스워드 상태          //
      const [password, setPassword] = useState<string>('');
      //          state: 패스워드 타입 상태          //
      const [passwordType, setPasswordType] = useState<'text'|'password'>('password');
      //          state: 패스워드 버튼 아이콘 상태          //
      const [passwordButtonIcon, setPasswordButtonIcon] = useState<'eye-light-off-icon' | 'eye-light-on-icon'>('eye-light-off-icon');
      //          state: 에러 상태          //
      const [error, setError] = useState<boolean>(false);

      //          function: sign in response 처리함수           //
      const signInResponse = (responseBody: SignInResponseDto | ResponseDto | null) => {
        const now2 = new Date().toLocaleString();

        console.log("----------------- 7 -------------------");
        console.log("지금 시간 : " + now2);
        console.log("---signInResponse 시작----");
        
        if (!responseBody){ // null인 경우, 백엔드의 서버가 안 켜진 경우 거의 null처리 됨.
          // console.log("---네트워크 이상입니다???----");
          alert('네트워크 이상입니다.');
          return;
        }

        const { code } = responseBody;
        // console.log("여기까지도 오나????11111");
        // console.log(code);
        if( code === 'DBE') alert('데이터베이스 오류입니다.');
        if( code === 'SF' || code === 'VF') setError(true);
        if( code !== 'SU') return;
        // console.log("여기까지도 오나????2222");
        //성공적으로 잘일어났다면, 

        // as의 역할
        // responseBody 변수를 SignInResponseDto 타입으로 타입 단언하여 
        // TypeScript 컴파일러에게 해당 객체가 SignInResponseDto의 인스턴스임을 명시적으로 알려준다. 
        //이를 통해 해당 객체를 SignInResponseDto 타입의 속성에 접근할 수 있게 된다.
        const { token, expirationTime } = responseBody as SignInResponseDto; //정확히 SignInResponseDto로 명시해줌
        const now   = new Date().getTime(); // 현재 시간
        //현재 시간에서 3600초(1시간)를 더해줘서 완료시간을 만들어줌
        const expires = new Date(now + expirationTime * 1000); // 만료 시간
        
        // 쿠키에 token과 만료시간, Main페이지의 경로를 넣는다
        console.log("----------------- 8 -------------------");
        console.log("지금 시간 : " + now2);
        console.log("---setCookies 시작----");
        // console.log(token.toString);
        setCookies('accessToken', token, {expires, path: MAIN_PATH()});
        // 그리고 navigator()함수를 이용해서 페이지를 이동시킨다.
        navigator(MAIN_PATH());
      }
      //          event handler: 이메일 변경 이벤트 처리         //
      const onEmailChangeHandler = (event: ChangeEvent<HTMLInputElement>) =>{
        setError(false);
        const {value} = event.target;
        setEmail(value);
      }
      //          event handler: 비밀번호 변경 이벤트 처리         //
      const onPasswordChangeHandler = (event: ChangeEvent<HTMLInputElement>) =>{
        setError(false);
        const {value} = event.target;
        setPassword(value);
      }
      //          event handler: 로그인 버튼 클릭 이벤트 처리         //
      const onSignInButtonClickHandler = () => { //요청을 보낼 requestBody를 만들어줌. 사용자가 입력한 값들이 signInRequest(매개변수)로 실행됨.
        const requestBody: SignInRequestDto = { email, password}; //사용자가 입력한 값들이 SignInRequestDto 타입으로 실려서 requestBody에 담긴 후 api 요청됨.
        signInRequest(requestBody).then(signInResponse); //결과가 받아진다면 .then(~~~) signInResponse란 이름으로 작업을 처리하겠다.(위쪽에 signInResponse란 function 생성.)
      }
      //          event handler: 회원가입 링크 클릭 이벤트 처리         //
      const onSignUpButtonClickHandler = () => {
        setView('sign-up');
      }

      //          event handler: 패스워드 버튼 클릭 이벤트 처리         //
      const onPasswordButtonClickHandler = () => {
        // console.log(passwordType);
        if(passwordType === 'text'){
          setPasswordType('password');
          setPasswordButtonIcon('eye-light-off-icon');
        }
        else{
          setPasswordType('text');
          setPasswordButtonIcon('eye-light-on-icon');
        }
      }
      //          event handler: 이메일 인풋 키 다운 이벤트 처리         //
      const onEmailKeyDownHandler = (event:KeyboardEvent<HTMLInputElement>) =>{
        if(event.key !== 'Enter') return;
        if(!passwordRef.current) return;
        passwordRef.current.focus();
      }
      //          event handler: 패스워드 키 다운 이벤트 처리         //
      const onPasswordKeyDownHandler = (event:KeyboardEvent<HTMLInputElement>) =>{
        if(event.key !== 'Enter') return;
        onSignInButtonClickHandler();//로그인 클릭 버튼이 눌린 것처럼 작동하게
      }
      //          render: sign In card 컴포넌트 랜더링          //
      return (
        <div className="auth-card">
          <div className="auth-card-box">
            <div className="auth-card-top">
              <div className="auth-card-title-box">
                <div className="auth-card-title">{'로그인'}</div>  
              </div>  
              {/* Ref를 할 수 있는 것은, InputBox에 forwardRef로 만들었기 때문에 */}
              <InputBox ref={emailRef} label="이메일 주소" type="text" placeholder="이메일 주소를 입력해주세요." error={error} value={email} onChange={onEmailChangeHandler} onKeyDown={onEmailKeyDownHandler} />
              <InputBox ref={passwordRef} label="패스워드" type={passwordType} placeholder="비밀번호를 입력해주세요." error={error} value={password} onChange={onPasswordChangeHandler} icon={passwordButtonIcon} onButtonClick={onPasswordButtonClickHandler} onKeyDown={onPasswordKeyDownHandler}/>
            </div>  
            <div className="auth-card-bottom">
              {/* 에러박스는 에러가 error가 true일때만 작동해라. */}
              {error && 
              <div className="auth-sign-in-error-box">
                <div className="auth-sign-in-error-message">
                  {'이메일 주소 또는 비밀번호를 잘못 입력했습니다. \n입력하신 내용을 다시 확인해주세요.'}
                </div>
              </div>
              }
              <div className="black-large-full-button" onClick={onSignInButtonClickHandler}>{'로그인'}</div>
              <div className="auth-description-box">
                <div className="auth-description">{'신규 사용자이신가요? '}<span className="auth-description-link" onClick={onSignUpButtonClickHandler}>{'회원가입'}</span></div>
              </div>  
            </div>  
          </div>          
        </div>
      )
    }
    //          component: sign up card 컴포넌트          //
    const SignUpCard = () =>{

      //          render: sign up card 컴포넌트 랜더링          //
      return (
        <div className="auth-card"></div>
      )
    }

  //          render: 인증 화면 컴포넌트 랜더링          //
  return (
  <div id="auth-wrapper">
    <div className="auth-container">
      <div className="auth-jumbotron-box">
        <div className="auth-jumbotron-contents">
          {/* <div className="auth-logo-icon"></div> */}
          <div className="auth-jumbotron-text-box">
            {/* <div className="auth-jumbotron-text">{"Hello,"}</div> */}
            {/* <div className="auth-jumbotron-text">{"I'm Web Developer Park Donghoon."}</div> */}
            <div className="auth-jumbotron-text">{"안녕하세요,"}</div>
            <div className="auth-jumbotron-text">{"신입 개발자 박동훈입니다."}</div>
          </div>
        </div>
      </div>
      {view === 'sign-in' && <SignInCard/>}
      {view === 'sign-up' && <SignUpCard/>}
    </div>
  </div>
  )
}
