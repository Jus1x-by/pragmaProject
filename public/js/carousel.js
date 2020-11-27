let slideIndex = 1;
showSlides(slideIndex);
        
function addSlide(n){
    showSlides(slideIndex += n);
    }

function currentSlide(n){
    showSlides(slideIndex = n);
}

function showSlides(n){
    let i;
    let slides = document.getElementsByClassName('carousel-item');
            
    if (n > slides.length){
        slideIndex = 1;
    }
    if(n < 1){
        slideIndex = slides.length
    }
    for(i=0; i < slides.length; i++){
        slides[i].style.display = "none";
    }
    slides[slideIndex-1].style.display = "flex";
}

let slideIndexSeason = 1;
showSlidesSeason(slideIndexSeason);
        
function addSlideSeason(n){
    showSlidesSeason(slideIndexSeason += n);
    }

function currentSlideSeason(n){
    showSlidesSeason(slideIndexSeason = n);
}

function showSlidesSeason(n){
    let i;
    let slides = document.getElementsByClassName('carousel-item-season');
            
    if (n > slides.length){
        slideIndexSeason = 1;
    }
    if(n < 1){
        slideIndexSeason = slides.length
    }
    for(i=0; i < slides.length; i++){
        slides[i].style.display = "none";
    }
    slides[slideIndexSeason-1].style.display = "flex";
}