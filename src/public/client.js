let store = {
  Data: { name: "", landingDate: "", launchDate: "", status: "", photos: [] },
  rovers: ["Curiosity", "Opportunity", "Spirit"],
};

// add our markup to the page
const root = document.getElementById("root");
const menu = document.querySelectorAll(".menu");
const imgs = document.querySelectorAll("img");

const updateStore = (store, newState) => {
  store = Object.assign(store, newState);
  render(root, store);
};

const render = async (root, state) => {
  root.innerHTML = App(state);
};

// App() - higher order function
const App = (state) => {
  const { rovers, Data } = state;

  return genHTML(Data);
};

const genHTML = (Data) => {
  return `
  <main>
    <section class="roverInfo">
    <h3 class="headSection">${Data.name}</h3>
      ${roverInfo(Data)}
    </section>
    <section class="roverImgs">
    ${imgRover(Data)}
    </section>
  </main>
  <footer>
    Designed by ...
  </footer>
  `;
};

// create content
const roverInfo = (Data) => {
  return `
        <div class="infoStyle"><span>Launch Date:</span> ${Data.launchDate}</div>
        <div class="infoStyle"><span>Landing Date:</span> ${Data.landingDate}</div>
        <div class="infoStyle"><span>Status:</span> ${Data.status}</div>
    `;
};

const imgRover = (Data) => {
  let imageHTML = ``;

  Data.photos.slice(0, 6).map((ele) => {
    imageHTML += `
    <div class="gridContainer">
      <img src="${ele[0]}" class="roversPhoto" />
      <div class="infoStyle"><span>Camera:</span> ${ele[1]}</div>
      <div class="infoStyle"><span>Date:</span> ${ele[2]}</div>
    </div>`;
  });

  return imageHTML;
};

const select = (menu) => {
  menu.forEach((tab) => {
    tab.addEventListener("click", (ele) => {
      const currTab = ele.target.id;
      updateStore(store, currTab);
      activeTab(menu, currTab);
      fetchData(currTab);
    });
  });
};

const selectImg = (menu) => {
  menu.forEach((tab) => {
    tab.addEventListener("click", (ele) => {
      const currTab = ele.target.id;
      activeImg(imgs, currTab);
    });
  });
};

const activeImg = (imgs, currentTab) => {
  imgs.forEach((tab) => {
    if (tab.id === currentTab) {
      tab.classList.add("activeImg");
    } else {
      tab.classList.remove("activeImg");
    }
  });
};

const activeTab = (tabs, currentTab) => {
  tabs.forEach((tab) => {
    if (tab.id === currentTab) {
      tab.classList.add("active");
    } else {
      tab.classList.remove("active");
    }
  });
};

// listening for load event because page should load before any JS is called
window.addEventListener("load", () => {
  select(menu);
  selectImg(menu);
  fetchData(store.rovers[0]);
  render(root, store);
});

// ------------------------------------------------------  COMPONENTS

const fetchData = (currTab) => {
  getRoverData(currTab);
};

// ------------------------------------------------------  API CALLS
const getRoverData = (name) => {
  fetch(`http://localhost:3000/rover-data/${name}`)
    .then((res) => res.json())
    .then((data) => {
      // console.log(data);
      let { name, landing_date, launch_date, status } =
        data.data.photos[0].rover;
      let photoData = [];
      data.data.photos.map((rover) =>
        photoData.push([
          rover.img_src,
          rover.camera.full_name,
          rover.earth_date,
        ])
      );
      let roverData = {
        Data: {
          name: name,
          landingDate: landing_date,
          launchDate: launch_date,
          status: status,
          photos: photoData,
        },
      };
      updateStore(store, roverData);
    });
};
