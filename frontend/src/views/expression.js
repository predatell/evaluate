import { useEffect, useState } from 'react';
import useAxios from "../utils/useAxios";
import { logout } from '../utils/auth';
import { useNavigate } from 'react-router-dom';
import { Alert } from 'reactstrap';


const Expression = () => {
  const api = useAxios();
  const navigate = useNavigate();    
  const mainUrl = "expressions/";    
  const [expression, setExpression] = useState('');        
  const [errorMessage, setErrorMessage] = useState('');
  const [apiData, setApiData] = useState({
    expressionList: [],
    nextUrl: null,
    previousUrl: null,
  });

  useEffect(() => {
    refreshList(mainUrl);
  }, []);  

  const refreshList = async (url) => {
    api
      .get(url)
      .then((res) => setApiData({
          expressionList: res.data.results,
          nextUrl: res.data.next,
          previousUrl: res.data.previous,          
      }))
      .catch((err) => setErrorMessage("No response was received"));
  };

  const handleChange = (e) => {
    setExpression(e.target.value);
    if (errorMessage) setErrorMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (expression) {
      api.post(mainUrl, { expression: expression })
      .then((res) => refreshList(mainUrl))
      .catch(function (error) {
        let message = "";      
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          // console.log(error.response.status);
          // console.log(error.response.data);
          if (error.response.status === 400 && error.response.data && error.response.data.expression) {
            message = error.response.data.expression[0];
          } else {
            message = error.response.statusText;
          };
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          // console.log(error.request);
          message = "No response was received";
        } else {
          // Something happened in setting up the request that triggered an Error
          // console.log('Error', error.message);
          message = error.message;
        }
        console.log(message);
        setErrorMessage(message);
        console.log(error.config);
      });
    } else {
      setErrorMessage("Input new expression");
    }
  };

  const handleNext = (e) => {
    if (apiData.nextUrl) refreshList(apiData.nextUrl);
  };

  const handlePrevious = (e) => {
    if (apiData.previousUrl) refreshList(apiData.previousUrl);
  };

  const handleLogout = (e) => {
    logout();
    navigate("/login");
  };
    
  const renderItems = () => {
    return apiData.expressionList.map((item) => (
      <li
        key={item.id}
        className="list-group-item d-flex justify-content-between align-items-center"
      >
        <span className={`mr-2`} >
          {item.expression}
        </span>
        <span className={`mr-2`} >
          = {item.result}
        </span>            
      </li>
    ));
  };

  return (
    <main className="container">
      <h1 className="text-uppercase text-center my-4">
        Expression Evaluation
        <button className="btn btn-secondary btn-sm" onClick={handleLogout} >Logout</button>
      </h1>
      <div className="row">
        <div className="col-md-8 col-sm-10 mx-auto">
          <div className="card p-3">
            <Alert color="info">You can use "abs", "length" and any functions from module math.</Alert>          
            {errorMessage ? (
              <Alert color="danger">{errorMessage}</Alert>
            ) : null}
            <form onSubmit={handleSubmit}>
              <div className="input-group mb-3">
                <input type="text" className="form-control" placeholder="" name="expression" onChange={handleChange} />
                <div className="input-group-append">
                  <button className="btn btn-primary" onClick={handleSubmit} >Evaluate</button>
                </div>
              </div>
            </form>
            <ul className="list-group list-group-flush border-top-0">
              {renderItems()}
            </ul>
            <div className="my-4">
              {apiData.previousUrl ? (
                <button className={`btn btn-primary`} onClick={handlePrevious}>Previous</button>
              ) : null}
              {apiData.nextUrl ? (
                <button className={`btn btn-primary float-right`} onClick={handleNext} >Next</button>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Expression;
