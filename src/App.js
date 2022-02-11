
import './Sass/style.scss';
import { useState, useEffect } from 'react';
import {ReactComponent as Search} from './assets/icon-search.svg';
import {ReactComponent as Twitter} from './assets/icon-twitter.svg';
import {ReactComponent as Moon} from './assets/icon-moon.svg';
import {ReactComponent as Sun} from './assets/icon-sun.svg';
import {ReactComponent as Company} from './assets/icon-company.svg';
import {ReactComponent as Location} from './assets/icon-location.svg';
import {ReactComponent as Website} from './assets/icon-website.svg';

function App() {
  const month = ['Jan', 'Feb', 'March', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const [username, setUsername] = useState('');
  const [profile, setProfile] = useState([]);
  const [darktheme, setDarktheme] = useState(false);

  useEffect(()=> {
    if (window.matchMedia) {
    // Check if the dark-mode Media-Query matches
    if(window.matchMedia('(prefers-color-scheme: dark)').matches){
      // Dark
      setDarktheme(true);
      document.body.classList.add('bg-dark');
    } else {
      // Light
      setDarktheme(false);
    }
  }
  }, [])
  

  
  // fetches the user profile
  const getUser = (USERNAME) => {
    fetch(`https://api.github.com/users/${USERNAME}`)
    .then(res => res.json())
    .then(data => setProfile(data))
    .catch(err => console.log(err))

    setUsername('');
  }

  // Formats the profile creation date into a readible format
  const formatDate = (DATE) => {
    const profile_date = new Date(DATE);
    const date_format = `${month[profile_date.getMonth()]} ${profile_date.getDate()} ${profile_date.getFullYear()}`
    return date_format;
  }

  // 
  const showNotAvailable = (input) => {
    if (input === null || input === ""){
      return "Not Available";
    }
    else{
      return input;
    }
  } 

  return (
    <div className={`App ${darktheme ? 'dark-theme':'light-theme'}`}>
      <div className="header">
        <div className="logo">
          <h1>devfinder</h1>
        </div>
        <button onClick={() => {setDarktheme(prev => !prev);
                                document.body.classList.toggle('bg-dark');
         }}>
          <div className="theme-container flex">
            { darktheme ? 
            <>
              <p>Light</p>
              <Sun />
            </> :
            <>
              <p>Dark</p>
              <Moon />
            </>
            }
          </div>
        </button>
        
      </div>
      <div className="search-bar flex">
        <div className="left flex">
          <Search />
          <input placeholder = "Search Github username..."  type="text" value={username} onChange={(e) => {setUsername(e.target.value)}}/>
        </div>
        <div className="right flex">
          <button onClick={() => getUser(username)}>Search</button>
        </div>
        
      </div>
      
      

      { (profile.length === 0) ? 
        <div className='profile-container--empty'>
          <p>Please enter a profile</p>
        </div>
        : <div className='profile-container'>
            

            {/* // Section 1: Name Avatar and creation date */}

            <div className="section-1 flex">
            <div className="avatar-container">
              <img src={profile.avatar_url} alt="Avatar" />
            </div>
              <div className="names flex">
                <div>
                  <p className='profile-name'>{profile.name !== null ? profile.name : profile.login}</p>
                  <a className ="login-name" href={profile.html_url} target="_blank" rel="noopener noreferrer" >@{profile.login}</a>
                </div>
                <div className="date-container">
                  <p className="date muted-white">{formatDate(profile.created_at)}</p>
                </div>
              </div>
              
            </div>

            {/* // Bio */}
            <div className= {`bio ${profile.bio === null ? 'muted-white':''}`}>
              <p>{profile.bio === null ? "This profile has no bio" : profile.bio}</p>
            </div>

            {/* // Stats: followers, repos, and following counts */}
            <div className="stats-container grid">
              <div className='stat-container flex'>
                <p className="stat-formatting muted-white">Repos<span>{profile.public_repos}</span></p>
              </div>
              <div className='stat-container flex'>
                <p className="stat-formatting muted-white">Followers<span>{profile.followers}</span></p>
              </div>
              <div className='stat-container flex'>
                <p className="stat-formatting muted-white">Following<span>{profile.following}</span></p>
              </div>
            </div>

            {/* // Miscellaneous: location, company, blog, and twitter handle */}

            <div className="miscellaneous grid">
              <div className='misc-item flex muted-white'><Location /> {showNotAvailable(profile.location)}</div>
              <div className='misc-item flex muted-white'><Website /> {showNotAvailable(profile.blog)}</div>
              <div className='misc-item flex muted-white'><Twitter /> {showNotAvailable(profile.twitter_username)}</div>
              <div className='misc-item flex muted-white'><Company /> {showNotAvailable(profile.company)}</div>
            </div>
              
          </div> 

        
      }

      
    </div>
  );
}

export default App;
