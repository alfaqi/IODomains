import { ethers } from "ethers";
import { useEffect, useState } from "react";

// Components
import Navigation from './components/Navigation';
import Search from './components/Search';
import Domain from './components/Domain';

// ABIs
import IODomains from './abis/IODomains.json';

// Config file
import config from './config.json';
import Dashboard from "./components/Dashboard";



function App() {
  const [account, setAccount] = useState(null);
  const [search, setSearch] = useState(null);
  const [provider, setProvider] = useState(null);
  const [domains, setDomains] = useState([]);
  const [contract, setContract] = useState(null)

  const [det, setDet] = useState(0);

  const tokens = (n) => {
    return ethers.utils.parseUnits(n.toString(), 'ether')
  }
  const loadData = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    setProvider(provider)

    const networkID = await provider.getNetwork()

    const contract = new ethers.Contract(
      config[networkID.chainId].IODomainsGoerli.address,
      IODomains.abi,
      provider
    )

    setContract(contract)

    const maxSupply = await contract.maxSupply();
    // const totalSupply = await contract.totalSupply();

    let arr = [];
    for (let i = 1; i <= Number(maxSupply); i++) {
      const domain = await contract.getDomain(i)
      // console.log(`Domain ${i} is : ${domain.name} and cost : ${ethers.utils.formatEther(domain.cost)} ETH`);
      arr.push(domain)
    }

    setDomains(arr);

    window.ethereum.on('accountsChanged', async () => {
      const accounts = await window.ethereum.request({ 'method': 'eth_requestAccounts' });
      setAccount(ethers.utils.getAddress(accounts[0]))
    })
  }

  const withdrawFunds = async () => {
    const signer = await provider.getSigner()

    console.log(signer)
    const transaction = await contract.connect(signer).withdraw()
    await transaction.wait()
    console.log(transaction)

  }
  const listNewDomains = async () => {
    const signer = await provider.getSigner()

    const names = ['a.eth', 'b.eth', 'c.eth', 'd.eth', 'e.eth', 'f.eth'];
    const cost = [tokens(0.005), tokens(0.005), tokens(0.005), tokens(0.005), tokens(0.005), tokens(0.005)];

    for (let i = 0; i < names.length; i++) {
      const transaction = await contract.connect(signer).list(names[i], cost[i]);
      await transaction.wait();

      console.log(`Listed domain ${i + 1}: ${names[i]}`);
    }

  }

  useEffect(() => {
    loadData();
  }, [])

  return (
    <div>
      <Navigation account={account} setAccount={setAccount} det={det} setDet={setDet} />
      <Search search={search} setSearch={setSearch} />
 
      <div className="cards__section">
        <h2 className="cards__title">
          Welcome to IO Domains
        </h2>
        <p>{search
          ? search + '.eth'
          : ''}</p>

        <p className="card__description">Own your custom username, use it across services, and
          be able to store an avatar and other profile data.
        </p>
        {det
          ? <Dashboard domain={domains[0]} ioDomains={contract} provider={provider} id={1} key={0} />
          : ''}
        <hr />
        {domains ? (
          <div className="cards">
            {domains.map((domain, index) => (
              <Domain domain={domain} ioDomains={contract} provider={provider} id={index + 1} key={index} />
            ))}
          </div>
        ) : (
          <h2 className="cards__title">loading...</h2>
        )}
        <hr />
        <div className="card">
          <button
            type="button"
            className="card__button"
            onClick={withdrawFunds}
          >
            Withdraw
          </button>
          <button
            type="button"
            className="card__button"
            onClick={listNewDomains}
          >
            List New Domains
          </button>
        </div>
      
      </div>
    </div>
  )
}

export default App