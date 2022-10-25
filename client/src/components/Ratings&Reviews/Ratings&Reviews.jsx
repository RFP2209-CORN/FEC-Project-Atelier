import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import RatingsBreakdownSidebar from './Ratings/RatingsBreakdownSidebar.jsx';
import AddReview from './Reviews/AddReview.jsx';
import ReviewsList from './Reviews/ReviewsList.jsx';

const RatingsAndReviews = ({ product_id }) => {

  product_id = 40344;


  const [ reviews, setReviews ] = useState([]);
  const [ rating, setRating ] = useState(0.0);
  const [ fiveStar, setFiveStar ] = useState(0);
  const [ fourStar, setFourStar ] = useState(0);
  const [ threeStar, setThreeStar ] = useState(0);
  const [ twoStar, setTwoStar ] = useState(0);
  const [ oneStar, setOneStar ] = useState(0);
  const [ totalNumberOfReviews, setTotalNumberOfReviews ] = useState(0);

  const [ prodName, setProdName ] = useState('');
  const [ star, setStar ] = useState();
  const [ recommend, setRecommend ] = useState(false);
  const [ photos, setPhotos ] = useState([]);
  const [ characteristics, setCharacteristics ] = useState({});
  const [ modalIsOpen, setIsOpen ] = useState(false);
  const [ metaData, setMetaData ] = useState({});
  const [ products, setProducts ] = useState({});

  const summaryRef = useRef();
  const bodyRef = useRef();
  const usernameRef = useRef();
  const emailRef = useRef();

  let data = {
    product_id: 40344,
    rating: 5,
    summary: "good stuff",
    body: "good stuff...looking forward to using this product",
    recommend: true,
    name: "questionasker",
    email: "questionasker@email.com",
    photos: ["https://static.vecteezy.com/system/resources/thumbnails/001/189/165/small/star.png"],
    characteristics: {"14": 5, "15": 5}
  }

  useEffect(() => {
    product_id = 40344;
    axios.get(`/reviews/${product_id}/count`)
      .then((results) => {
        console.log('reviews by product_id', results.data.results)
        let productReviews = results.data.results;
        let totalRating = 0;
        productReviews.forEach((review) => {
          totalRating += review.rating;
        })
        let averageRating = totalRating / productReviews.length;
        averageRating = Math.round(averageRating * 10) / 10;
        setRating(averageRating);
        setReviews(productReviews);
      })
      .catch((error) => {
        console.log(error)
      })
    axios.get(`/reviews/meta/${product_id}`)
    .then((results) => {
      console.log('results.data from successful axios request to get meta data', results.data);
      let individualRatings = results.data.ratings;
      console.log('individualRatings', individualRatings);
      let total = 0;
      for (var key in individualRatings) {
        let ratings = parseInt(individualRatings[key]);
        total += ratings;
        key === '1' && setOneStar(ratings);
        key === '2' && setTwoStar(ratings);
        key === '3' && setThreeStar(ratings);
        key === '4' && setFourStar(ratings);
        key === '5' && setFiveStar(ratings);
      }
      setTotalNumberOfReviews(total);
      setMetaData(results.data);
    })
    axios.get(`/products/${product_id}`)
    .then((results) => {
      console.log('results.data from successful axios request to get product name', results.data);
      setProdName(results.data.name);
      setProducts(results.data);
    })
    .catch((error) => {
      console.log(error);
    })
  }, []);

  const handleYesClick = () => {
    console.log('move handleYesClick function here later')
    // axios.put('/reviews/')
  }

  const addReview = (data) => {
     axios.post('/reviews', data)
      .then((response) => {
        console.log('successful axios post request from client to add a new review')
        console.log('response.data', response.data);
      })
      .catch((error) => {
        console.log('error', error);
      })
  }

  return (
    <>
    <div className="flexbox-container">
      <div className="sidebar">
        < RatingsBreakdownSidebar setReviews={setReviews} reviews={reviews} fiveStar={fiveStar} fourStar={fourStar} threeStar={threeStar} twoStar={twoStar} oneStar={oneStar} totalNumberOfReviews={totalNumberOfReviews} rating={rating} />
      </div>
      <ReviewsList reviews={reviews} rating={rating} totalNumberOfReviews={totalNumberOfReviews} />
    </div>
    <AddReview product_id={product_id} prodName={prodName} metaData={metaData} addReview={addReview}/>
    </>
  );
}

export default RatingsAndReviews;