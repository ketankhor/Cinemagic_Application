document.addEventListener('DOMContentLoaded', async () => {
    const reviewCon = document.querySelector('#review')
    const data = await fetchMovie();
    console.log('hi',data)
    if(!data)return alert('select movie')
    if (data.movie && data.reviews) {
        let { movie, reviews } = data;
        loadMovie(movie);
        loadReviews(reviews);
        postReviewInit(movie);

    } else {
       alert(data.message)
        reviewCon.innerHTML = '';
        let con = document.querySelector('#details')
        con.innerHTML = ''

    }


});
async function postReviewInit(movie) {
    const submitReview = document.querySelector('#reviewCon');
    submitReview.addEventListener('submit', async e => {
        e.preventDefault();
        const tarea = document.querySelector('#reviewCon textarea')
        if(tarea.value?.trim()==='')return alert('review not specified')
        const review = JSON.stringify({ review: tarea.value })
        
        const res = await fetch(`http://127.0.0.1:3000/api/movies/${movie._id}`, {
            method: 'POST',
            body: review,
            headers: {
                'content-type': 'application/json',
            },
            credentials: "same-origin"
        });
        const data = await res.json();
        alert(data.message + ' by ' + data.user?.userName)
        window.location.reload()
        console.log(data)
    });


}

async function fetchMovie() {
    let parseCookie = document.cookie?.split(';');
    let info = parseCookie.map(cookie => cookie.trim()).find(cookie => cookie.startsWith('info'));
    if (!info) return false
    let [id, category] = info.split('=')[1].split(',');
    console.log(id, category)
    const res = await fetch(`http://127.0.0.1:3000/api/movies/${id}?category=${category}&review=true`).catch(console.log)
    const data = await res.json()
    console.log(data)
    return data;
}
const getCard = review =>{
    const user=JSON.parse(localStorage.getItem('user'))
    let button='';
    console.log(review)
    // console.log(user.userName===review.user.userName)

    // delete button
       if(user?.username===review.user.userName)
           button=`<button  style='color:red' data-ID=${review._id} onclick=deleteReview(this)>delete</button>`
    return`<div class="testimonial-box">
    <!--top------------------------->
    <div class="box-top">
        <!--profile----->
        <div class="profile">
            
            <!--name-and-username-->
            <div class="name-user">
                <strong>${review.user.name}</strong>
                <span>${review.user.userName}</span>
            </div>
        </div>
        
    </div>
    <!--Comments---------------------------------------->
    <div class="client-comment">
        <p>${review.review}</p>
    </div>`+button+`
</div>
`.replace(/\n|\t/g, '');
}
const setCards = (cards) => document.querySelector('#review').innerHTML = cards;
window.onscroll = function () { myFunction() };

const getDetailsCard = async (movie) => {
    const URL = `https://www.imdb.com/title/${movie.imdbId}/`;
    const details = await getDetails(movie.imdbId);
    const template = `
    <div class="col-md-8 ps-0">
<div class="event1r bg-white p-4 shadow_box">
<h5 class="text-uppercase"><a href=${URL} target="_blank">${movie.title}</a></h5>
<h6>#${movie.category}
    <span class="col_red pull-right">
        <i class="fa fa-star"></i>
        <i class="fa fa-star"></i>
        <i class="fa fa-star"></i>
        <i class="fa fa-star"></i>
        <i class="fa fa-star-o"></i>
    </span>
</h6>
<hr>
<ul>
    <li><strong>Title: </strong>${movie.title}</li>
    <li><strong>Language: </strong>${details.language}</li>
    <li><strong>Imdb: </strong><a href=${URL} target="_blank">link</a></li>
    <li><strong>Release date: </strong>${details.released}</li>
    <li><strong>Ratings: </strong>${details.ratings}/10</li>
</ul>
<hr>
<ul>
    <li><strong>Actors: </strong>${details.actors}</li>
    <li><strong>Director: </strong>${details.director}</li>
    <li><strong>Genre: </strong>${details.genre}</li>
    <li><strong>Runtime: </strong>${details.runtime}</li>
</ul>
<p class="mt-3">Plot: ${details.plot}</p>
</div>
</div>`.replace(/\n|\t/g, '');
    return template;
}
async function getDetails(imdbId) {
    const res = await fetch(`https://www.omdbapi.com/?i=${imdbId}&apikey=826aaca6`)
    const data = await res.json();
    return {
        released: data.Released,
        runtime: data.Runtime,
        genre: data.Genre,
        director: data.Director,
        actors: data.Actors,
        plot: data.plot,
        ratings: data.imdbRating,
        language: data.Language
    }
}
async function loadMovie(movie) {
    let card = await getDetailsCard(movie);
    let img = document.querySelector('#img');
    img.src = movie.posterURL;
    let con = document.querySelector('#details')
    con.innerHTML = card

}
function loadReviews(reviews) {
    console.log(reviews);
    let cards = reviews.map(review => getCard(review));
    cards = cards.join(' ');
    setCards(cards)
}

async function deleteReview(button){
    const {id}= button.dataset
   await fetch(`http://127.0.0.1:3000/api/movies/${id}`,{method:'delete'})
    window.location.reload()
    
}
