import { ethers } from 'ethers';
import logo from '../assets/logo.svg';

const Navigation = ({ account, setAccount,det, setDet }) => {
  const connectionHandler = async () => {
    if (window.ethereum !== undefined) {
      try {
        const accounts = await window.ethereum.request({ 'method': 'eth_requestAccounts' });
        setAccount(ethers.utils.getAddress(accounts[0]))
        // console.log(account);
      } catch (error) {
        console.error(error);
      }
    } else {
      alert('Please install Metamask wallet')
    }
  }

  const a = () => {
    setDet(1)
  }
  return (
    <nav>
      <div className='nav__brand'>
        <img src={logo} alt='Logo' />
        <h1>IO Domains</h1>
        <ul className='nav__links'>
          <li><a href='#'>Domain Names</a></li>
          <li><a href='#'>Websites & Hosting</a></li>
          <li><a href='#'>Commerce</a></li>
          <li><a href='#' onClick={a}>Details</a></li>
        </ul>
      </div>
      {account
        ? (
          <button
            type='button'
            className='nav__connect'
          >
            {account.slice(0, 5) + '...' + account.slice(38, 42)}
          </button>
        ) :
        (
          <button
            type='button'
            className='nav__connect' onClick={connectionHandler}>
            Connect
          </button>
        )
      }
    </nav>
  );
}

export default Navigation;