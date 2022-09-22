import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Container, InputGroup, FormControl, Button, Row, Card} from 'react-bootstrap';
import {useState, useEffect } from 'react';



const CLIENT_ID="da0c762c124047af9e4488abf40546de";
const CLIENT_SECRET="fb16f9c596cd492a9dfc817439a5a5c2";

function App() {
  const [searchInput, setSearchInput] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [albums, setAlbums] = useState([]);


  useEffect(() =>{
    
    var authParameters = {
      method: 'POST',
      headers:{
        'Content-Type':'application/x-www-form-urlencoded'
      },
      body:'grant_type=client_credentials&client_id=' + CLIENT_ID + '&client_secret=' +CLIENT_SECRET
    }
    fetch('https://accounts.spotify.com/api/token', authParameters)
    .then(result => result.json())
    .then(data => setAccessToken(data.access_token))
  }, [])

 async function search() {
    console.log("Search for " +searchInput); 


    var searchParameter = {
      method:'GET',
      headers:{
        'Content-Type':'application/json',
        'Authorization':'Bearer ' + accessToken
      }
    }
    var artistID = await fetch('https://api.spotify.com/v1/search?q='+ searchInput+ '&type=artist', searchParameter)
    .then(respone => respone.json())
    .then(data => { return data.artists.items[0].id })

    console.log("Artist ID is " + artistID);

    var returnedalbums = await fetch ('https://api.spotify.com/v1/artists/' + artistID + '/albums' + '?include_groups=album&market=US&limit=50' ,searchParameter)
    .then(respone => respone.json())
    .then(data => { 
      console.log(data);
      setAlbums(data.items);
     });
   
 }
console.log(albums)
  return (
    <div className="App">
     <Container>
      <InputGroup className="mb-3" size="lg">
        <FormControl
        placeholder="Search for Artist"
        type ="input"
        onKeyPress={event =>{
          if(event.key == "Enter"){
            search();
          }
        }}
        onChange={event => setSearchInput(event.target.value)}
        />
        <Button onClick={search}>
          Search
        </Button>
      </InputGroup>
     </Container>
     <Container>
      <Row className="mx-2 row row-cols-4">
        {albums.map ( (album, i) => {
          console.log(album);
          return (
            <Card>
        <Card.Img src={album.images[0].url} />
        <Card.Body>
          <Card.Title>{album.name}</Card.Title>
        </Card.Body>
      </Card>
        )
        })}
      
      </Row>

     </Container>
    </div>
  );
}

export default App;

