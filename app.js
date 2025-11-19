let currentSong = new Audio();

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  const formattedMins = String(mins).padStart(2, '0');
  const formattedSecs = String(secs).padStart(2, '0');
  return `${formattedMins}:${formattedSecs}`;
}

async function getSongs() {
  let a = await fetch("http://127.0.0.1:5500/songs/");
  let response = await a.text();
  console.log(response);
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  let songs = [];
  for (let i = 0; i < as.length; i++) {
    const element = as[i];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split("/songs/")[1]);
    }
  }

  return songs;
}

const playMusic = (track, pause=false) => {
  currentSong.src = "/songs/" + track;
  if(!pause){
    currentSong.play()
    play.src = "images/pause.svg";
  } 
  document.querySelector(".songinfo").innerHTML = track;
  document.querySelector(".songtime").innerHTML = "00:00/00:00";
};

async function main() {
  // Get the list of all the songs
  let songs = await getSongs();
  playMusic(songs[0], true)

  //show all the songs in the playlist
  let songUL = document
    .querySelector(".songList")
    .getElementsByTagName("ul")[0];
  for (const song of songs) {
    songUL.innerHTML =
      songUL.innerHTML +
      `<li> 
    <img class="invert" src="images/music.svg" alt="">
                    <div class="info">
                        <div>${song}</div>
                        <div>Song Artist</div>
                    </div>
                    <div class="playnow">
                        <span>Play Now</span>
                        <img class="invert" src="images/play.svg" alt="">
                    </div> </li>`;
  }

  //Attach an event listener to each song
  Array.from(document.querySelectorAll(".songList li")).forEach((e) => {
    e.addEventListener("click", (element) => {
      console.log(e.querySelector(".info").firstElementChild.innerHTML);
      playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
    });
  });

  //Attach an event listener to play, next and previous
  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "images/pause.svg";
    } else {
      currentSong.pause();
      play.src = "images/play.svg";
    }
  });

  //Listen for timeupdate event
  currentSong.addEventListener("timeupdate", ()=>{
    console.log(currentSong.currentTime, currentSong.duration);
    document.querySelector(".songtime").innerHTML = `${formatTime(currentSong.currentTime)}/${formatTime(currentSong.duration)}`
    document.querySelector(".circle").style.left = (currentSong.currentTime/ currentSong.duration) * 100 + "%";
  })

  //add an event listner to seekbar
  document.querySelector(".seekbar").addEventListener("click", e=>{
    let percent = (e.offsetX/e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentSong.currentTime = ((currentSong.duration)* percent)/100
  })
}

main();
