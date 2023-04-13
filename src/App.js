import { useEffect, useState } from "react";
import { ethers } from "ethers";

// Components
import Navigation from "./components/Navigation";
import Home from "./components/Home";
import Search from "./components/Search";
// This is test commit
// ABIs
import RealEstate from "./abis/RealEstate.json";
import Escrow from "./abis/Escrow.json";

// Config
import config from "./config.json";
const getEthereumObject = () => window.ethereum;

function App() {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [escrow, setEscrow] = useState(null);
  const [homes, setHomes] = useState([]);
  const [home, setHome] = useState({});
  const [toggle, setToggle] = useState(false);

  const getBlockChainData = async () => {
    try {
      const ethereum = getEthereumObject();
      if (!ethereum) {
        console.log("Make sure you have Metamask installed");
        return null;
      }
      const provider = new ethers.providers.Web3Provider(ethereum);
      setProvider(provider);
      const network = await provider.getNetwork();
      console.log(network)
      const escrowAddress =config[config.defaultChainID].escrow.address;

      const realEstate = new ethers.Contract(
        config[config.defaultChainID].realEstate.address,
        RealEstate,
        provider
      );
      const escrow = new ethers.Contract(
        escrowAddress,
        Escrow,
        provider
      );
      setEscrow(escrow);

      const totalSupply = await realEstate.totalSupply();
      const homes = [];
      for (var i = 1; i <= totalSupply; i++) {
        const uri = await realEstate.tokenURI(i);
        const response = await fetch(uri);
        const metadata = await response.json();
        homes.push(metadata);
      }
      setHomes(homes);
      console.log("We have ethereum object: ", ethereum);
      const accounts = await ethereum.request({ method: "eth_accounts" });
      ethereum.on("accountsChanged", async () => {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const account = ethers.utils.getAddress(accounts[0]);
        setAccount(account);
      });
      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Authorized account found! ", account);
        return account;
      } else {
        console.log("No authorized account found!");
        return null;
      }
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  useEffect(() => {
    async function loadData() {
      const account = await getBlockChainData();
      if (account !== null) {
        setAccount(account);
      }
    }

    loadData();
  }, []);

  const togglePop = (home) => {
    setHome(home);
    toggle ? setToggle(false) : setToggle(true);
  };

  return (
    <div>
      <Navigation account={account} setAccount={setAccount} />
      <Search />
      <div className="cards__section">
        <h3>Homes for you</h3>
        <hr />
        <div className="cards">
          {homes.length > 0 ? (
            homes.map((home, index) => (
              <div className="card" key={index} onClick={() => togglePop(home)}>
                <div className="card__image">
                  <img alt="Home" src={home.image}></img>
                </div>
                <div className="card__info">
                  <h4>{home.attributes[0].value} MATIC</h4>
                  <p>
                    <strong>{home.attributes[2].value}</strong> bds |
                    <strong>{home.attributes[3].value}</strong> ba |
                    <strong>{home.attributes[4].value}</strong> sqft
                  </p>
                  <p>{home.address}</p>
                </div>
              </div>
            ))
          ) : (
            <p>is loading...</p>
          )}
        </div>
      </div>
      {toggle && (
        <Home
          home={home}
          provider={provider}
          account={account}
          escrow={escrow}
          togglePop={togglePop}
        />
      )}
    </div>
  );
}

export default App;