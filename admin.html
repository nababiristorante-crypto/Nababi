/* =========================================================
   NABABI RISTORANTE — ADMIN LOGIN
   ========================================================= */

let supabaseClient = null;


/* ---------------------------------------------------------
   SUPABASE INITIALIZATION
   --------------------------------------------------------- */

function initSupabase(){

  try{

    if(
      typeof window.supabase === "undefined"
    ){
      throw new Error("Supabase library not loaded.");
    }

    if(
      typeof SUPABASE_URL === "undefined" ||
      typeof SUPABASE_ANON_KEY === "undefined"
    ){
      throw new Error(
        "SUPABASE_URL or SUPABASE_ANON_KEY is missing in config.js"
      );
    }

    supabaseClient = window.supabase.createClient(
      SUPABASE_URL,
      SUPABASE_ANON_KEY
    );

    return true;

  }catch(error){

    console.error(error);

    showLoginError(
      "Supabase configuration সমস্যা হয়েছে। config.js check করুন।"
    );

    return false;
  }
}


/* ---------------------------------------------------------
   LOGIN ERROR
   --------------------------------------------------------- */

function showLoginError(message){

  const box = document.getElementById("loginError");

  if(!box) return;

  box.textContent = message;
  box.classList.remove("hidden");
}


/* ---------------------------------------------------------
   CLEAR ERROR
   --------------------------------------------------------- */

function clearLoginError(){

  const box = document.getElementById("loginError");

  if(!box) return;

  box.textContent = "";
  box.classList.add("hidden");
}


/* ---------------------------------------------------------
   SHOW ADMIN
   --------------------------------------------------------- */

function showAdmin(user){

  const loginPage =
    document.getElementById("loginPage");

  const adminApp =
    document.getElementById("adminApp");

  const userEmail =
    document.getElementById("userEmail");

  if(loginPage){
    loginPage.classList.add("hidden");
  }

  if(adminApp){
    adminApp.classList.remove("hidden");
  }

  if(userEmail && user){
    userEmail.textContent =
      user.email || "Administrator";
  }

}


/* ---------------------------------------------------------
   SHOW LOGIN
   --------------------------------------------------------- */

function showLogin(){

  const loginPage =
    document.getElementById("loginPage");

  const adminApp =
    document.getElementById("adminApp");

  if(loginPage){
    loginPage.classList.remove("hidden");
  }

  if(adminApp){
    adminApp.classList.add("hidden");
  }

}


/* ---------------------------------------------------------
   LOGIN
   --------------------------------------------------------- */

async function login(email,password){

  if(!supabaseClient){

    if(!initSupabase()){
      return;
    }
  }

  clearLoginError();

  const button =
    document.getElementById("loginBtn");

  if(button){

    button.disabled = true;
    button.textContent = "Logging in...";

  }

  try{

    const {
      data,
      error
    } =
    await supabaseClient.auth.signInWithPassword({
      email: email,
      password: password
    });


    if(error){

      console.error("LOGIN ERROR:",error);

      throw error;
    }


    if(!data || !data.user){

      throw new Error(
        "Login successful হলেও user পাওয়া যায়নি।"
      );

    }


    /*
      IMPORTANT:
      এখানে কোনো admin_staff table check করা হচ্ছে না।
      তাই valid Supabase login-কে role table-এর কারণে
      আটকে দেওয়া হবে না।
    */

    showAdmin(data.user);


  }catch(error){

    console.error(error);

    let message =
      "Login করা যায়নি। Email অথবা password check করুন।";

    if(error && error.message){

      message = error.message;

    }

    showLoginError(message);

  }finally{

    if(button){

      button.disabled = false;
      button.textContent = "Login";

    }

  }

}


/* ---------------------------------------------------------
   LOGOUT
   --------------------------------------------------------- */

async function logout(){

  try{

    if(supabaseClient){

      await supabaseClient.auth.signOut();

    }

  }catch(error){

    console.error("Logout error:",error);

  }

  showLogin();

}


/* ---------------------------------------------------------
   CHECK EXISTING SESSION
   --------------------------------------------------------- */

async function checkSession(){

  if(!supabaseClient) return;

  try{

    const {
      data,
      error
    } =
    await supabaseClient.auth.getSession();

    if(error){

      console.error(error);
      return;

    }

    if(
      data &&
      data.session &&
      data.session.user
    ){

      showAdmin(data.session.user);

    }else{

      showLogin();

    }

  }catch(error){

    console.error("Session error:",error);

    showLogin();

  }

}


/* ---------------------------------------------------------
   NAVIGATION
   --------------------------------------------------------- */

function setupNavigation(){

  const buttons =
    document.querySelectorAll(
      ".nav button[data-section]"
    );

  const sections =
    document.querySelectorAll(
      ".section"
    );

  const title =
    document.getElementById("pageTitle");


  buttons.forEach(button => {

    button.addEventListener("click",function(){

      const target =
        this.dataset.section;

      buttons.forEach(btn =>
        btn.classList.remove("active")
      );

      this.classList.add("active");


      sections.forEach(section => {

        section.classList.remove("active");

      });


      const targetSection =
        document.getElementById(target);

      if(targetSection){

        targetSection.classList.add("active");

      }


      const text =
        this.textContent
          .replace(/[^\p{L}\p{N}\s&/+-]/gu,"")
          .trim();

      if(title){

        title.textContent =
          text || "Admin";

      }


      const sidebar =
        document.getElementById("sidebar");

      if(
        window.innerWidth <= 800 &&
        sidebar
      ){

        sidebar.classList.remove("open");

      }

    });

  });

}


/* ---------------------------------------------------------
   MOBILE MENU
   --------------------------------------------------------- */

function setupMobileMenu(){

  const toggle =
    document.getElementById("menuToggle");

  const sidebar =
    document.getElementById("sidebar");

  if(!toggle || !sidebar) return;

  toggle.addEventListener("click",function(){

    sidebar.classList.toggle("open");

  });

}


/* ---------------------------------------------------------
   HERO SAVE
   --------------------------------------------------------- */

function saveHero(){

  const message =
    document.getElementById("heroMessage");

  if(message){

    message.textContent =
      "Hero information ready to save.";

  }

}


/* ---------------------------------------------------------
   ABOUT SAVE
   --------------------------------------------------------- */

function saveAbout(){

  const message =
    document.getElementById("aboutMessage");

  if(message){

    message.textContent =
      "About information ready to save.";

  }

}


/* ---------------------------------------------------------
   CONTACT SAVE
   --------------------------------------------------------- */

function saveContact(){

  const message =
    document.getElementById("contactMessage");

  if(message){

    message.textContent =
      "Contact information ready to save.";

  }

}


/* ---------------------------------------------------------
   SOCIAL SAVE
   --------------------------------------------------------- */

function saveSocial(){

  const message =
    document.getElementById("socialMessage");

  if(message){

    message.textContent =
      "Social media information ready to save.";

  }

}


/* ---------------------------------------------------------
   HOURS SAVE
   --------------------------------------------------------- */

function saveHours(){

  const message =
    document.getElementById("hoursMessage");

  if(message){

    message.textContent =
      "Opening hours ready to save.";

  }

}


/* ---------------------------------------------------------
   ADD CATEGORY
   --------------------------------------------------------- */

function addCategory(){

  const input =
    document.getElementById("newCategory");

  const select =
    document.getElementById("menuCategory");

  const message =
    document.getElementById("categoryMessage");

  if(!input || !select) return;

  const name =
    input.value.trim();

  if(!name){

    if(message){

      message.textContent =
        "আগে একটি category name লিখুন.";

    }

    return;

  }


  const exists =
    [...select.options].some(
      option =>
        option.value.toLowerCase() ===
        name.toLowerCase()
    );


  if(exists){

    if(message){

      message.textContent =
        "এই category ইতিমধ্যে আছে.";

    }

    return;

  }


  const option =
    document.createElement("option");

  option.value = name;
  option.textContent = name;

  select.appendChild(option);

  select.value = name;

  input.value = "";

  if(message){

    message.textContent =
      "New category added.";

  }

}


/* ---------------------------------------------------------
   LOGIN FORM
   --------------------------------------------------------- */

function setupLogin(){

  const form =
    document.getElementById("loginForm");

  if(!form) return;


  form.addEventListener("submit",async function(event){

    event.preventDefault();

    const email =
      document.getElementById("email")
        .value
        .trim();

    const password =
      document.getElementById("password")
        .value;


    if(!email || !password){

      showLoginError(
        "Email এবং password দুটোই দিতে হবে।"
      );

      return;

    }


    await login(email,password);

  });

}


/* ---------------------------------------------------------
   START
   --------------------------------------------------------- */

document.addEventListener("DOMContentLoaded",async function(){

  const ready =
    initSupabase();

  if(!ready) return;

  setupLogin();

  setupNavigation();

  setupMobileMenu();

  const logoutButton =
    document.getElementById("logoutBtn");

  if(logoutButton){

    logoutButton.addEventListener(
      "click",
      logout
    );

  }

  await checkSession();

});
