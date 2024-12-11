import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import useMediaQuery from '@mui/material/useMediaQuery';
import { styled as muiStyled }from '@mui/system';
import styled from 'styled-components';
import logo from '../assets/Presto.png';
import landingPagePhoto from '../assets/LandingpagePhoto.png';

const Body = styled.div`
    margin: 0;
    padding: 0;
    background-color: #B3CAD8;
    justify-content: center;
    align-items: center;
    height: 100vh;
    width: 100%;
`

const DispayFlexContainer = styled.div`
    display: flex;
`

const PortraitLogo = styled.img`
    height: 12vh;
    width: 12vh;
    padding-left: 0.5vh;
    margin-right: -1.3vh;
`

const PortraitTitle = styled.div`
    display: inline-flex;
    font-weight: bolder;
    font-size: 3vh;
    padding-top: 4vh;
    color: #DCCFCF;
`
const Title1 = styled.span`
    color: #457AAC;
`

const FlexboxContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    width: 100vw;
`

const PortraitFlexboxContainer = styled(FlexboxContainer)`
    flex-direction: column;
    align-items: center;
    align-self: center;
`
const PortraitTextFlexbox = styled.div`
        height: 20vh;
`
const Text = styled.p`
    color: black;
    font-weight: bolder;
    width: 100%;
`
const PortraitWelcomeText = styled(Text)`
    display: flex;
    justify-content: center;
    font-size: 5vh;
`
const PortraitLoginText = styled(Text)`
    display: flex;
    justify-content: center;
    text-align: center;
    font-size: 2vh;
`
const PortraitImageFlexbox = styled.div`
    display: flex;
    justify-content: center;
    padding: 6vh 0px;
`

const Illustration = styled.img`
    height: 30vmax;
    width: 30vmax;
`

const PortraitButtonFlexbox = styled.div`
    display: flex;
    height: 10vw;
    width: 100%;
    justify-content: center;
`

const PortraitLoginButton = muiStyled(Button)({
  height: '5vh',
  width: '30vw',
  backgroundColor: '#022545',
  fontFamily: 'Arial, sans-serif',
  borderRadius: '10px',
  textTransform: 'none',
  fontWeight: 'bold',
  fontSize: '2.5vh',
  '&:hover': {
    backgroundColor: '#457AAC',
  },
});

const LandscapeLogo = styled.img`
    height: 7vw;
    width: 7vw;
    padding-left: 0.5vw;
    right: -1vw;
`

const LandscapeTitle = styled.div`
    font-size: 2.7vw;
    padding-top: 2vw;
    display: inline-flex;
    font-weight: bolder;
    color: #DCCFCF;
`

const LandscapeTextFlexbox = styled.div`
    margin-top: 11vh;
    width: 50vw;
    height: 22.5vw;
    display: flex;
    flex-wrap: wrap;
    padding-left: 8vw;
`

const LandscapeFlexboxContainer = styled(FlexboxContainer)`
    flex-direction: row;
`

const LandscapeWelcomeText = styled(Text)`
    font-size: 4vw;
    margin-bottom: 0px;
    display: flex;
    align-items: flex-end;
`

const LandscapeLoginText = styled(Text)`
    margin: 0px;
    height: min-content;
    font-size: 2.7vw;
    padding-right: 5vw;
`

const LandscapeImageFlexbox = styled.div`
    margin-top: 15vh;
    width: 40vw;
    display: flex;
    justify-content: left;
`

const LandscapeButtonFlexbox = styled(DispayFlexContainer)`
    padding-left: 8vw;
    width: 50vw;
`

const LandscapeLoginButton = muiStyled(PortraitLoginButton)({
  height: '3.5vw',
  width: '10vw',
  borderRadius: '1vh',
  '&:hover': {
    backgroundColor: '#457AAC',
  },
});

const LandingPage = () => {

  const isPortrait = useMediaQuery('(orientation: portrait)');

  const navigate = useNavigate();

  const HandleLoginClick = () => {
    navigate('/login');
  };

  return (
    <>
      {isPortrait ? (
        <>
          <Body>
            <DispayFlexContainer>
              <PortraitLogo src={logo} alt="Logo" />
              <PortraitTitle>
                <Title1>PRESTO</Title1>
              </PortraitTitle>
            </DispayFlexContainer>
            <PortraitFlexboxContainer>
              <PortraitTextFlexbox>
                <PortraitWelcomeText>Welcome!</PortraitWelcomeText>
                <PortraitLoginText>Login to Make Your Presentation Today</PortraitLoginText>
              </PortraitTextFlexbox>
                    
              <PortraitImageFlexbox>
                <Illustration src={landingPagePhoto} alt='Panda making slide deck image'></Illustration>
              </PortraitImageFlexbox>
                    
              <PortraitButtonFlexbox>
                <PortraitLoginButton name="login-button" variant='contained' onClick={HandleLoginClick}>Login</PortraitLoginButton>
                <PortraitLoginButton name="register-button" style={{marginLeft: "10px"}} variant='contained' onClick={()=>{navigate("/register")}}>Register</PortraitLoginButton>

              </PortraitButtonFlexbox>
                
            </PortraitFlexboxContainer>
          </Body>
        </>
      ) : (
        <>
          <Body>
            <DispayFlexContainer>
              <LandscapeLogo src={logo} alt="Logo" />
              <LandscapeTitle>
                <Title1>PRESTO</Title1>
              </LandscapeTitle>
            </DispayFlexContainer>
            <LandscapeFlexboxContainer>
              <div>
                <LandscapeTextFlexbox>
                  <LandscapeWelcomeText>Welcome!</LandscapeWelcomeText>
                  <LandscapeLoginText>Login to Make Your Presentation Today</LandscapeLoginText>
                </LandscapeTextFlexbox>
                    
                <LandscapeButtonFlexbox>
                  <LandscapeLoginButton name="login-button" variant='contained' onClick={HandleLoginClick}>Login</LandscapeLoginButton>
                  <LandscapeLoginButton name="register-button" style={{marginLeft: "10px"}} variant='contained' onClick={()=>{navigate("/register")}}>Register</LandscapeLoginButton>
                </LandscapeButtonFlexbox>
              </div>
                
              <LandscapeImageFlexbox>
                <Illustration src={landingPagePhoto} alt='Panda making slide deck image' />
              </LandscapeImageFlexbox>
            </LandscapeFlexboxContainer>
          </Body>
        </>
      )}
    </>
  );
};

export default LandingPage;