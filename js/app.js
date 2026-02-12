document.addEventListener('DOMContentLoaded', function () {

// ======================== AUTHENTICATION ========================
var userCredentials=[
    {uid:0,username:'johndoe',password:'john2024',name:'John Doe',img:12,bio:'Living my best life'},
    {uid:1,username:'sarahmiller',password:'sarah2024',name:'Sarah Miller',img:32,bio:'Photography lover'},
    {uid:2,username:'mikejohnson',password:'mike2024',name:'Mike Johnson',img:15,bio:'Music & Gaming'},
    {uid:3,username:'emilychen',password:'emily2024',name:'Emily Chen',img:25,bio:'Travel addict'},
    {uid:4,username:'davidpark',password:'david2024',name:'David Park',img:45,bio:'Fitness & Food'},
    {uid:5,username:'jameswilson',password:'james2024',name:'James Wilson',img:11,bio:'Skater & Artist'},
    {uid:6,username:'lisawang',password:'lisa2024',name:'Lisa Wang',img:16,bio:'Bookworm'},
    {uid:7,username:'carlosrivera',password:'carlos2024',name:'Carlos Rivera',img:22,bio:'Music Producer'},
    {uid:8,username:'annakowalski',password:'anna2024',name:'Anna Kowalski',img:35,bio:'Fitness Coach'},
    {uid:9,username:'tombradley',password:'tom2024',name:'Tom Bradley',img:53,bio:'Gamer & Streamer'},
    {uid:10,username:'priyasharma',password:'priya2024',name:'Priya Sharma',img:60,bio:'Dog Mom & Chef'},
    {uid:11,username:'jordanlee',password:'jordan2024',name:'Jordan Lee',img:51,bio:'Night owl coder'},
    {uid:12,username:'sophietaylor',password:'sophie2024',name:'Sophie Taylor',img:44,bio:'Plant parent'},
    {uid:13,username:'marcusbrown',password:'marcus2024',name:'Marcus Brown',img:52,bio:'Basketball fan'},
    {uid:14,username:'ninapatel',password:'nina2024',name:'Nina Patel',img:43,bio:'Yoga & Mindfulness'},
    {uid:15,username:'chrisanderson',password:'chris2024',name:'Chris Anderson',img:54,bio:'Road trip junkie'},
    {uid:16,username:'oliviamartinez',password:'olivia2024',name:'Olivia Martinez',img:41,bio:'Coffee snob'},
    {uid:17,username:'ryankim',password:'ryan2024',name:'Ryan Kim',img:55,bio:'Sneakerhead'},
    {uid:18,username:'zoewilliams',password:'zoe2024',name:'Zoe Williams',img:42,bio:'Cat lover'},
    {uid:19,username:'ethanmoore',password:'ethan2024',name:'Ethan Moore',img:56,bio:'Hiking enthusiast'},
    {uid:20,username:'miajackson',password:'mia2024',name:'Mia Jackson',img:36,bio:'Art & Design'}
];

function authLogin(username,password){
    var u=username.toLowerCase().trim();
    return userCredentials.find(function(c){return c.username===u&&c.password===password;})||null;
}
function authGetSession(){
    try{var d=localStorage.getItem('dq_session');return d?JSON.parse(d):null;}catch(e){return null;}
}
function authSetSession(user,remember){
    var data={uid:user.uid,username:user.username,name:user.name,img:user.img};
    if(remember) localStorage.setItem('dq_session',JSON.stringify(data));
    else sessionStorage.setItem('dq_session',JSON.stringify(data));
    window._tgUser=data;
}
function authClearSession(){
    localStorage.removeItem('dq_session');
    sessionStorage.removeItem('dq_session');
    window._tgUser=null;
}
function authGetUser(){
    if(window._tgUser) return window._tgUser;
    try{
        var d=localStorage.getItem('dq_session')||sessionStorage.getItem('dq_session');
        if(d){window._tgUser=JSON.parse(d);return window._tgUser;}
    }catch(e){}
    return null;
}

// --- Login page wiring ---
var loginPage=document.getElementById('loginPage');
var appShell=document.getElementById('appShell');
var loginForm=document.getElementById('loginForm');
var loginError=document.getElementById('loginError');
var loginUser=document.getElementById('loginUsername');
var loginPass=document.getElementById('loginPassword');

function showApp(){
    loginPage.classList.add('hidden');
    appShell.classList.add('active');
}
function showLogin(){
    loginPage.classList.remove('hidden');
    appShell.classList.remove('active');
}

// Toggle password visibility
document.getElementById('togglePassword').addEventListener('click',function(){
    var inp=loginPass;
    var icon=this.querySelector('i');
    if(inp.type==='password'){inp.type='text';icon.className='fas fa-eye-slash';}
    else{inp.type='password';icon.className='fas fa-eye';}
});

// Login form submit
loginForm.addEventListener('submit',function(e){
    e.preventDefault();
    loginError.classList.remove('show');
    var u=loginUser.value.trim();
    var p=loginPass.value;
    if(!u||!p){loginError.textContent='Please enter both username and password.';loginError.classList.add('show');return;}
    var user=authLogin(u,p);
    if(!user){loginError.textContent='Invalid username or password.';loginError.classList.add('show');return;}
    authSetSession(user,document.getElementById('rememberMe').checked);
    loginForm.reset();
    showApp();
});

// Forgot password & create account stubs
document.querySelector('.login-forgot').addEventListener('click',function(e){e.preventDefault();alert('Password reset is not available in this demo.');});
document.querySelector('.login-create').addEventListener('click',function(e){e.preventDefault();alert('Account creation is not available in this demo.');});

// Check session on load
if(authGetUser()){
    showApp();
} else {
    showLogin();
}

// ======================== STATE ========================
var myFollowers=[1,3,8,10,12];
var state = {
    coins: 5000,
    following: 0,
    followers: 5,
    followedUsers: {},
    ownedSkins: {},
    activeSkin: null,
    ownedFonts: {},
    activeFont: null,
    ownedLogos: {},
    activeLogo: null,
    notifications: [],
    joinedGroups: {},
    messages: {},
    likedPosts: {},
    coverPhoto: null,
    comments: {},
    ownedIconSets: {},
    activeIconSet: null,
    ownedCoinSkins: {},
    activeCoinSkin: null,
    ownedTemplates: {},
    activeTemplate: null,
    ownedNavStyles: {},
    activeNavStyle: null,
    ownedPremiumSkins: {},
    activePremiumSkin: null,
    groupPosts: {},
    privateFollowers: false,
    dislikedPosts: {},
    photos:{profile:[],cover:[],post:[],albums:[]}
};
// Pre-follow 15 users and pre-join groups (persists as hardcoded init)
(function(){for(var i=1;i<=15;i++){state.followedUsers[i]=true;}state.following=15;state.joinedGroups[13]=true;state.joinedGroups[1]=true;state.joinedGroups[3]=true;})();

// ======================== SAVED / HIDDEN / REPORTS (localStorage) ========================
var savedFolders=JSON.parse(localStorage.getItem('dq_savedFolders')||'[{"id":"fav","name":"Favorites","posts":[]}]');
var hiddenPosts=JSON.parse(localStorage.getItem('dq_hiddenPosts')||'{}');
var reportedPosts=JSON.parse(localStorage.getItem('dq_reports')||'[]');
function persistSaved(){localStorage.setItem('dq_savedFolders',JSON.stringify(savedFolders));}
function persistHidden(){localStorage.setItem('dq_hiddenPosts',JSON.stringify(hiddenPosts));}
function persistReports(){localStorage.setItem('dq_reports',JSON.stringify(reportedPosts));}
var blockedUsers=JSON.parse(localStorage.getItem('dq_blockedUsers')||'{}');
function persistBlocked(){localStorage.setItem('dq_blockedUsers',JSON.stringify(blockedUsers));}
function findPostFolder(pid){var s=String(pid);for(var i=0;i<savedFolders.length;i++){if(savedFolders[i].posts.indexOf(s)!==-1)return savedFolders[i];}return null;}

// ======================== DATA ========================
var people = [
    {id:1,name:'Sarah Miller',bio:'Photography lover',img:32},{id:2,name:'Mike Johnson',bio:'Music & Gaming',img:15,priv:true},
    {id:3,name:'Emily Chen',bio:'Travel addict',img:25},{id:4,name:'David Park',bio:'Fitness & Food',img:45,priv:true},
    {id:5,name:'James Wilson',bio:'Skater & Artist',img:11},{id:6,name:'Lisa Wang',bio:'Bookworm',img:16,priv:true},
    {id:7,name:'Carlos Rivera',bio:'Music Producer',img:22},{id:8,name:'Anna Kowalski',bio:'Fitness Coach',img:35},
    {id:9,name:'Tom Bradley',bio:'Gamer & Streamer',img:53,priv:true},{id:10,name:'Priya Sharma',bio:'Dog Mom & Chef',img:60},
    {id:11,name:'Jordan Lee',bio:'Night owl coder',img:51,priv:true},{id:12,name:'Sophie Taylor',bio:'Plant parent',img:44},
    {id:13,name:'Marcus Brown',bio:'Basketball fan',img:52,priv:true},{id:14,name:'Nina Patel',bio:'Yoga & Mindfulness',img:43},
    {id:15,name:'Chris Anderson',bio:'Road trip junkie',img:54,priv:true},{id:16,name:'Olivia Martinez',bio:'Coffee snob',img:41},
    {id:17,name:'Ryan Kim',bio:'Sneakerhead',img:55,priv:true},{id:18,name:'Zoe Williams',bio:'Cat lover',img:42},
    {id:19,name:'Ethan Moore',bio:'Hiking enthusiast',img:56,priv:true},{id:20,name:'Mia Jackson',bio:'Art & Design',img:36,priv:true}
];
// Assign skins/fonts/templates to people for profile previews
(function(){var sk=[null,'midnight','ocean','forest','royal','sunset'];var fn=[null,'orbitron','rajdhani','quicksand','pacifico','baloo'];var tp=[null,'panorama','compact','reverse','dashboard','cinema','magazine'];people.forEach(function(p){p.skin=sk[p.id%sk.length];p.font=fn[p.id%fn.length];p.template=tp[p.id%tp.length];});})();

// Friends map — each person's connections (bidirectional). People follow each other here.
var friendsOf={
    1:[2,3,6,10,12],2:[1,5,9,13],3:[1,4,7,14],4:[3,8,10,19],5:[2,11,15,17],
    6:[1,12,16,18],7:[3,9,13,20],8:[4,14,19],9:[2,7,11,17],10:[1,4,12,20],
    11:[5,9,15],12:[6,10,16],13:[2,7,17],14:[3,8,18],15:[5,11,19],
    16:[6,12,20],17:[5,9,13],18:[6,14],19:[4,8,15],20:[7,10,16]
};
// Build follower/following counts per person from friendsOf
var personFollowers={},personFollowing={};
people.forEach(function(p){personFollowers[p.id]=[];personFollowing[p.id]=[];});
Object.keys(friendsOf).forEach(function(id){
    var uid=parseInt(id);
    friendsOf[uid].forEach(function(fid){
        if(personFollowing[uid].indexOf(fid)===-1) personFollowing[uid].push(fid);
        if(personFollowers[fid].indexOf(uid)===-1) personFollowers[fid].push(uid);
    });
});

// ======================== POST LIKERS ========================
var postLikers={};
function getLikers(postId,likeCount){
    if(postLikers[postId]) return postLikers[postId];
    // Deterministic shuffle using postId as seed
    var seed=typeof postId==='string'?postId.split('').reduce(function(a,c){return a+c.charCodeAt(0);},0):postId;
    var shuffled=people.slice();
    for(var i=shuffled.length-1;i>0;i--){
        var j=(seed*(i+1)*31+7)%shuffled.length;
        if(j<0) j=-j;
        var tmp=shuffled[i];shuffled[i]=shuffled[j];shuffled[j]=tmp;
    }
    var count=Math.min(likeCount,shuffled.length);
    postLikers[postId]=shuffled.slice(0,count);
    return postLikers[postId];
}

// ======================== POST COMMENTS ========================
var commentTexts=[
    "Love this!","So true!","This is amazing","Wow, great post!","Totally agree",
    "Need more of this","This made my day","Incredible!","Can relate to this","Goals!",
    "Couldn't agree more","Beautiful!","That's awesome","This is everything","Absolutely love this",
    "Haha yes!","So inspiring","Well said","This is gold","Perfect"
];
var postComments={};
var likedComments={};
var dislikedComments={};
var commentCoinAwarded={};
var commentReplies={};
function getComments(postId){
    if(postComments[postId]) return postComments[postId];
    var seed=typeof postId==='string'?postId.split('').reduce(function(a,c){return a+c.charCodeAt(0);},0):postId;
    // Not all posts get comments — roughly 60% do
    if((seed*7+3)%10<4){postComments[postId]=[];return [];}
    var count=(seed*13+5)%8;// 0-7 comments
    var shuffled=people.slice();
    for(var i=shuffled.length-1;i>0;i--){
        var j=(seed*(i+1)*17+11)%shuffled.length;if(j<0)j=-j;
        var tmp=shuffled[i];shuffled[i]=shuffled[j];shuffled[j]=tmp;
    }
    var result=[];
    for(var i=0;i<count;i++){
        result.push({person:shuffled[i%shuffled.length],text:commentTexts[(seed+i*7)%commentTexts.length],likes:((seed+i*3)%6)});
    }
    postComments[postId]=result;
    return result;
}

// Get recommended people: friends of who you follow, minus people you already follow
function getFriendsOfFollowed(){
    var seen={};
    Object.keys(state.followedUsers).forEach(function(uid){
        var flist=friendsOf[uid]||[];
        flist.forEach(function(fid){if(!state.followedUsers[fid]) seen[fid]=true;});
    });
    return people.filter(function(p){return seen[p.id]&&!blockedUsers[p.id];});
}

var postTexts = [
    "Just got back from the most incredible hiking trip! The views were absolutely unreal. Spent the whole weekend disconnected and it was exactly what I needed.",
    "Made homemade pasta from scratch for the first time today and honestly? Life changing. The texture is completely different from store-bought.",
    "Finally finished reading that book everyone's been talking about. No spoilers but WOW that ending hit different. Who else has read it?",
    "Adopted a rescue puppy today!! Meet my new best friend. Still trying to pick a name - drop your suggestions below!",
    "Just ran my first 10K! Never thought I'd be a runner but here we are. The feeling of crossing that finish line was incredible.",
    "Tried that new ramen place downtown. The tonkotsu broth was next level. Already planning my next visit honestly.",
    "Spent the morning at a farmers market and came home with way too many plants. My apartment is officially a jungle now.",
    "Movie night recommendations? Looking for something mind-bending. Already seen Inception and Interstellar a million times.",
    "Can't believe it's already been a year since I moved to this city. Best decision I ever made. The people here are amazing.",
    "Just learned how to make latte art! It only took about 50 failed attempts but my rosetta is looking pretty decent now.",
    "Weekend project: built a bookshelf from scratch! It's a little crooked but I'm proud of it. DIY life is the best life.",
    "Golden hour at the beach today was absolutely magical. Sometimes you just need to watch a sunset and reset.",
    "Anyone else obsessed with that new show? I've watched 3 seasons in 2 days. I need to go outside but also I need to know what happens.",
    "Cooked dinner for friends tonight. Nothing fancy, just good food and great conversations. These are the moments that matter.",
    "Just got tickets to the music festival next month! Already planning my outfits. Who else is going?",
    "Took my camera out for the first time in months. Street photography hits different when the weather is perfect.",
    "Tried rock climbing for the first time today. My arms are already sore but I'm hooked. When can I go again??",
    "Made my own sourdough starter. Day 1 of waiting for it to do its thing. This is either going to be amazing or a disaster.",
    "Finally organized my closet using that method everyone talks about. Does sparking joy actually work? TBD but it looks clean.",
    "Road trip playlist suggestions needed! We're driving 8 hours this weekend and I need good vibes only.",
    "Just finished a 30-day yoga challenge. My flexibility has improved so much and I actually feel calmer. Highly recommend.",
    "Tried painting for the first time. Let's just say my cat could do better but it was therapeutic nonetheless.",
    "Game night with friends was CHAOTIC. Who knew board games could get so competitive? Friendships were tested.",
    "Early morning coffee on the balcony while it rains is peak existence. Nothing else matters in that moment.",
    "Finally learned to ride a skateboard at 25. Only fell 47 times. Progress??",
    "Started a garden on my balcony. So far I've successfully kept a basil plant alive for 2 weeks. Small wins.",
    "That feeling when your favorite song comes on shuffle. Just vibing at the grocery store like nobody's watching.",
    "Went stargazing last night and saw a shooting star! Made a wish but I can't tell you or it won't come true.",
    "Baked cookies for my neighbors just because. The look on their faces was worth every minute of effort.",
    "Sunday morning routine: pancakes, coffee, and zero plans. This is what happiness looks like.",
    "Just discovered a hidden waterfall on a random trail. Nature really said 'surprise!' Best detour ever.",
    "Hosted a potluck dinner. Everyone brought their signature dish. My kitchen is a mess but my heart is full.",
    "Learned three chords on guitar today. I'm basically a musician now right? Anyway here's wonderwall.",
    "Volunteered at the animal shelter today. I almost came home with 5 cats. Self-control was really tested.",
    "First time making sushi at home. It looks nothing like the restaurant but tastes pretty good honestly!",
    "Caught the most beautiful rainbow after the storm today. Reminder that good things come after tough times.",
    "Started journaling before bed and wow, it really helps clear the mind. Should've started this years ago.",
    "Bike ride through the park this morning. Perfect weather, no traffic, just pure freedom on two wheels.",
    "Tried that viral recipe everyone's been posting. Actually turned out amazing! Sometimes the internet delivers.",
    "Spent the day at a pottery class. Made a very questionable bowl but the process was so relaxing and fun."
];

var tagSets = [
    ['#hiking','#nature','#outdoors','#adventure'],['#cooking','#homemade','#foodie','#yum'],
    ['#reading','#books','#bookworm','#literature'],['#puppy','#rescue','#dogsoftwitter','#adopt'],
    ['#running','#fitness','#10k','#goals'],['#ramen','#foodie','#downtown','#eats'],
    ['#plants','#plantparent','#jungle','#green'],['#movies','#filmrec','#cinema','#watchlist'],
    ['#citylife','#newbeginnings','#blessed','#grateful'],['#coffee','#latteart','#barista','#morning'],
    ['#diy','#woodwork','#handmade','#weekend'],['#beach','#sunset','#goldenhour','#vibes'],
    ['#tvshow','#binge','#streaming','#addicted'],['#dinner','#friends','#goodtimes','#love'],
    ['#music','#festival','#concert','#livemusic'],['#photography','#street','#urban','#camera'],
    ['#climbing','#bouldering','#adventure','#active'],['#sourdough','#baking','#bread','#patience'],
    ['#organize','#declutter','#minimalist','#clean'],['#roadtrip','#playlist','#drive','#travel'],
    ['#yoga','#wellness','#mindful','#challenge'],['#painting','#art','#creative','#therapy'],
    ['#gamenight','#boardgames','#friends','#fun'],['#coffee','#rain','#cozy','#mornings'],
    ['#skateboard','#newskills','#falling','#learning'],['#garden','#balcony','#herbs','#growing'],
    ['#music','#vibing','#shuffle','#mood'],['#stargazing','#nature','#night','#wonder'],
    ['#baking','#cookies','#neighbors','#kindness'],['#sunday','#pancakes','#noplan','#bliss'],
    ['#waterfall','#hike','#discover','#nature'],['#potluck','#community','#food','#friends'],
    ['#guitar','#music','#learning','#beginner'],['#volunteer','#animals','#shelter','#love'],
    ['#sushi','#homemade','#japanese','#cooking'],['#rainbow','#storm','#hope','#beautiful'],
    ['#journal','#mindfulness','#writing','#reflect'],['#biking','#park','#freedom','#exercise'],
    ['#viral','#recipe','#trending','#delicious'],['#pottery','#craft','#creative','#relaxing']
];

var badgeTypes = [
    {text:'Trending',icon:'fa-fire',cls:'badge-red'},{text:'Creator',icon:'fa-camera',cls:'badge-purple'},
    {text:'Popular',icon:'fa-star',cls:'badge-orange'},{text:'Active',icon:'fa-bolt',cls:'badge-green'},
    {text:'New',icon:'fa-sparkles',cls:'badge-blue'}
];
var locations = ['New York','LA','Chicago','London','Tokyo','Paris','Berlin','Toronto','Sydney','Miami',
    'Seattle','Austin','Denver','Portland','Boston','SF','Dublin','Amsterdam','Seoul','Mumbai'];

var groups = [
    {id:1,name:'Street Photography',desc:'Share your best urban shots with the community.',icon:'fa-camera-retro',members:9,color:'#e74c3c'},
    {id:2,name:'Indie Gamers',desc:'Discuss and discover the best indie games.',icon:'fa-gamepad',members:6,color:'#3b82f6'},
    {id:3,name:'Home Cooks Unite',desc:'Recipes, tips, and kitchen fails welcome.',icon:'fa-utensils',members:9,color:'#e67e22'},
    {id:4,name:'Fitness Motivation',desc:'Daily workouts and progress check-ins.',icon:'fa-dumbbell',members:7,color:'#2ecc71'},
    {id:5,name:'Lo-Fi Beats Collective',desc:'Chill beats, playlists, and new drops.',icon:'fa-music',members:5,color:'#8b5cf6'},
    {id:6,name:'Pet Parents',desc:'Cute pics and pet care advice.',icon:'fa-paw',members:11,color:'#ec4899'},
    {id:7,name:'Budget Travel Hacks',desc:'Explore the world without breaking the bank.',icon:'fa-plane-departure',members:8,color:'#14b8a6'},
    {id:8,name:'Book Club Central',desc:'Monthly reads, reviews, and recommendations.',icon:'fa-book',members:4,color:'#6366f1'},
    {id:9,name:'Plant People',desc:'From succulents to monstera, all plants welcome.',icon:'fa-leaf',members:6,color:'#22c55e'},
    {id:10,name:'Movie Buffs',desc:'Reviews, watchlists, and hot takes.',icon:'fa-film',members:10,color:'#f59e0b'},
    {id:11,name:'DIY & Crafts',desc:'Build it, paint it, craft it yourself.',icon:'fa-hammer',members:3,color:'#ef4444'},
    {id:12,name:'Coffee Enthusiasts',desc:'Pour-overs, espresso, and everything in between.',icon:'fa-mug-hot',members:5,color:'#92400e'},
    {id:13,name:'Palasade',desc:'A cozy little corner of the internet where chaos meets creativity. Share wins, random thoughts, spicy takes, and the occasional unhinged meme.',icon:'fa-fire',members:16,color:'#f97316',createdBy:'me',memberIds:[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]}
];
// Initialize per-group roles: mods array holds Co-Admin and Moderator entries
groups.forEach(function(g){g.mods=[];});
// Palasade (id:13) — I am Admin, Emily Chen is Co-Admin, Sarah Miller & Mike Johnson are Mods
groups[12].mods=[{name:'Emily Chen',img:25,role:'Co-Admin'},{name:'Sarah Miller',img:32,role:'Moderator'},{name:'Mike Johnson',img:15,role:'Moderator'}];
// Street Photography (id:1) — I am just a Member
groups[0].mods=[{name:'Sarah Miller',img:32,role:'Moderator'},{name:'Mike Johnson',img:15,role:'Moderator'}];
// Home Cooks Unite (id:3) — I am a Moderator
groups[2].mods=[{name:'John Doe',img:12,role:'Moderator'},{name:'Sarah Miller',img:32,role:'Moderator'}];

// Helper: get my role in a group
function getMyGroupRole(group){
    if(group.createdBy==='me') return 'Admin';
    var entry=group.mods.find(function(m){return m.name==='John Doe';});
    if(entry) return entry.role;
    return state.joinedGroups[group.id]?'Member':null;
}
// Helper: get a person's role in a group
function getPersonGroupRole(person,group){
    var adminName=group.adminName||'John Doe';
    if(group.createdBy&&person.name===adminName) return 'Admin';
    if(group.createdBy==='me'&&person.name==='John Doe') return 'Admin';
    var entry=group.mods.find(function(m){return m.name===person.name;});
    return entry?entry.role:'Member';
}
// Role hierarchy rank
function roleRank(role){return role==='Admin'?4:role==='Co-Admin'?3:role==='Moderator'?2:1;}

var skins = [
    {id:'classic',name:'Classic',desc:'Clean teal and white. The original DabbleHQ look.',price:1,preview:'linear-gradient(135deg,#5cbdb9,#4aada9)',cardBg:'#fff',cardText:'#333',cardMuted:'#777'},
    {id:'midnight',name:'Midnight Dark',desc:'Dark mode profile with neon accents. Sleek and mysterious vibes.',price:1,preview:'linear-gradient(135deg,#1a1a2e,#16213e)',cardBg:'#2a2a4a',cardText:'#eee',cardMuted:'#bbb'},
    {id:'ocean',name:'Ocean Blue',desc:'Cool ocean vibes for your profile. Calm and refreshing.',price:1,preview:'linear-gradient(135deg,#1976d2,#0d47a1)',cardBg:'#e3f2fd',cardText:'#1565c0',cardMuted:'#1976d2'},
    {id:'forest',name:'Forest Green',desc:'Nature-inspired earthy tones. Peaceful and grounded.',price:1,preview:'linear-gradient(135deg,#2e7d32,#1b5e20)',cardBg:'#e8f5e9',cardText:'#2e7d32',cardMuted:'#388e3c'},
    {id:'royal',name:'Royal Purple',desc:'Elegant purple royalty vibes. Stand out from the crowd.',price:1,preview:'linear-gradient(135deg,#7b1fa2,#4a148c)',cardBg:'#f3e5f5',cardText:'#6a1b9a',cardMuted:'#7b1fa2'},
    {id:'sunset',name:'Sunset Gold',desc:'Warm golden hour aesthetic. Radiate warmth and energy.',price:1,preview:'linear-gradient(135deg,#ef6c00,#e65100)',cardBg:'#fff8e1',cardText:'#e65100',cardMuted:'#ef6c00'},
    {id:'cherry',name:'Cherry Blossom',desc:'Soft pink sakura vibes. Delicate and romantic.',price:1,preview:'linear-gradient(135deg,#d81b60,#c2185b)',cardBg:'#fce4ec',cardText:'#c2185b',cardMuted:'#d81b60'},
    {id:'slate',name:'Slate Storm',desc:'Cool dark gray sophistication. Sleek and modern.',price:1,preview:'linear-gradient(135deg,#37474f,#263238)',cardBg:'#37474f',cardText:'#eceff1',cardMuted:'#90a4ae'},
    {id:'ember',name:'Ember Glow',desc:'Warm smoldering red-orange. Bold and fiery.',price:1,preview:'linear-gradient(135deg,#e64a19,#bf360c)',cardBg:'#fbe9e7',cardText:'#bf360c',cardMuted:'#e64a19'},
    {id:'arctic',name:'Arctic Frost',desc:'Icy cyan chill. Clean and refreshing.',price:1,preview:'linear-gradient(135deg,#00acc1,#00838f)',cardBg:'#e0f7fa',cardText:'#00838f',cardMuted:'#00acc1'},
    {id:'moss',name:'Moss Garden',desc:'Olive earth tones. Calm and grounded.',price:1,preview:'linear-gradient(135deg,#689f38,#558b2f)',cardBg:'#f1f8e9',cardText:'#558b2f',cardMuted:'#689f38'}
];

var fonts = [
    {id:'orbitron',name:'Orbitron',desc:'Futuristic sci-fi vibes.',price:1,family:'Orbitron'},
    {id:'rajdhani',name:'Rajdhani',desc:'Clean tech aesthetic.',price:1,family:'Rajdhani'},
    {id:'quicksand',name:'Quicksand',desc:'Soft and rounded.',price:1,family:'Quicksand'},
    {id:'pacifico',name:'Pacifico',desc:'Fun handwritten script.',price:1,family:'Pacifico'},
    {id:'baloo',name:'Baloo 2',desc:'Bubbly and adorable.',price:1,family:'Baloo 2'},
    {id:'playfair',name:'Playfair Display',desc:'Elegant serif style.',price:1,family:'Playfair Display'},
    {id:'spacegrotesk',name:'Space Grotesk',desc:'Modern geometric sans.',price:1,family:'Space Grotesk'},
    {id:'caveat',name:'Caveat',desc:'Casual handwriting feel.',price:1,family:'Caveat'},
    {id:'archivo',name:'Archivo',desc:'Sharp and editorial.',price:1,family:'Archivo'},
    {id:'silkscreen',name:'Silkscreen',desc:'Retro pixel vibes.',price:1,family:'Silkscreen'}
];

var logos = [
    {id:'twdl',name:'TWDL',desc:'Minimal and edgy.',price:1,text:'TWDL'},
    {id:'electric',name:'Electric',desc:'High energy vibes.',price:1,text:'\u26A1DabbleHQ'},
    {id:'sparkle',name:'Sparkle',desc:'Fancy and elegant.',price:1,text:'\u2726DabbleHQ\u2726'},
    {id:'floral',name:'Floral',desc:'Soft flower energy.',price:1,text:'\uD83C\uDF38DabbleHQ'},
    {id:'ribbon',name:'Ribbon',desc:'Super cute and sweet.',price:1,text:'\uD83C\uDF80DabbleHQ\uD83C\uDF80'},
    {id:'crown',name:'Crown',desc:'Royal and majestic.',price:1,text:'\uD83D\uDC51DabbleHQ'},
    {id:'wave',name:'Wave',desc:'Chill ocean flow.',price:1,text:'\uD83C\uDF0ADabbleHQ'},
    {id:'rocket',name:'Rocket',desc:'Launch into orbit.',price:1,text:'\uD83D\uDE80DabbleHQ'},
    {id:'gem',name:'Diamond',desc:'Rare and precious.',price:1,text:'\uD83D\uDC8ETG\uD83D\uDC8E'},
    {id:'minimal',name:'Minimal',desc:'Less is more.',price:1,text:'tg.'}
];

var defaultIcons={home:'fa-home',groups:'fa-users-rectangle',skins:'fa-palette',profiles:'fa-user-group',shop:'fa-store',messages:'fa-envelope',notifications:'fa-bell',like:'fa-thumbs-up',dislike:'fa-thumbs-down',comment:'fa-comment',share:'fa-share-from-square',search:'fa-search',edit:'fa-pen',bookmark:'fa-bookmark',heart:'fa-heart'};
var activeIcons=JSON.parse(JSON.stringify(defaultIcons));
var iconSets = [
    {id:'rounded',name:'Rounded',desc:'Soft rounded icons.',price:1,preview:'linear-gradient(135deg,#ff9a9e,#fad0c4)',icons:{home:'fa-house',groups:'fa-people-group',skins:'fa-brush',profiles:'fa-address-book',shop:'fa-bag-shopping',messages:'fa-comment-dots',notifications:'fa-bell-concierge',like:'fa-thumbs-up',dislike:'fa-thumbs-down',comment:'fa-message',share:'fa-share-from-square',search:'fa-magnifying-glass',edit:'fa-pen-fancy',bookmark:'fa-flag',heart:'fa-heart'}},
    {id:'techy',name:'Techy',desc:'Futuristic tech icons.',price:1,preview:'linear-gradient(135deg,#667eea,#764ba2)',icons:{home:'fa-microchip',groups:'fa-network-wired',skins:'fa-swatchbook',profiles:'fa-id-card',shop:'fa-cart-shopping',messages:'fa-satellite-dish',notifications:'fa-tower-broadcast',like:'fa-thumbs-up',dislike:'fa-thumbs-down',comment:'fa-comment-dots',share:'fa-share-nodes',search:'fa-magnifying-glass',edit:'fa-wrench',bookmark:'fa-database',heart:'fa-bolt'}},
    {id:'playful',name:'Playful',desc:'Fun and cute icons.',price:1,preview:'linear-gradient(135deg,#f093fb,#f5576c)',icons:{home:'fa-heart',groups:'fa-hands-holding',skins:'fa-wand-magic-sparkles',profiles:'fa-face-smile',shop:'fa-gift',messages:'fa-paper-plane',notifications:'fa-star',like:'fa-thumbs-up',dislike:'fa-thumbs-down',comment:'fa-comments',share:'fa-share',search:'fa-wand-magic-sparkles',edit:'fa-pen-nib',bookmark:'fa-star',heart:'fa-face-kiss-wink-heart'}},
    {id:'nature',name:'Nature',desc:'Earth-inspired icons.',price:1,preview:'linear-gradient(135deg,#11998e,#38ef7d)',icons:{home:'fa-tree',groups:'fa-seedling',skins:'fa-leaf',profiles:'fa-sun',shop:'fa-mountain',messages:'fa-wind',notifications:'fa-cloud',like:'fa-thumbs-up',dislike:'fa-thumbs-down',comment:'fa-comment-dots',share:'fa-share-from-square',search:'fa-binoculars',edit:'fa-seedling',bookmark:'fa-tree',heart:'fa-sun'}},
    {id:'cosmic',name:'Cosmic',desc:'Space-themed icons.',price:1,preview:'linear-gradient(135deg,#0f0c29,#302b63)',icons:{home:'fa-rocket',groups:'fa-meteor',skins:'fa-moon',profiles:'fa-globe',shop:'fa-shuttle-space',messages:'fa-satellite',notifications:'fa-explosion',like:'fa-thumbs-up',dislike:'fa-thumbs-down',comment:'fa-comment-dots',share:'fa-arrow-up-from-bracket',search:'fa-user-astronaut',edit:'fa-screwdriver-wrench',bookmark:'fa-moon',heart:'fa-sun'}},
    {id:'medieval',name:'Medieval',desc:'Knights and castles era.',price:1,preview:'linear-gradient(135deg,#8B4513,#D2691E)',icons:{home:'fa-chess-rook',groups:'fa-shield-halved',skins:'fa-scroll',profiles:'fa-helmet-safety',shop:'fa-coins',messages:'fa-dove',notifications:'fa-bell',like:'fa-thumbs-up',dislike:'fa-thumbs-down',comment:'fa-message',share:'fa-hand-holding',search:'fa-compass',edit:'fa-hammer',bookmark:'fa-bookmark',heart:'fa-shield-heart'}},
    {id:'ocean',name:'Ocean',desc:'Deep sea aquatic icons.',price:1,preview:'linear-gradient(135deg,#006994,#00CED1)',icons:{home:'fa-anchor',groups:'fa-fish',skins:'fa-water',profiles:'fa-person-swimming',shop:'fa-ship',messages:'fa-bottle-water',notifications:'fa-otter',like:'fa-thumbs-up',dislike:'fa-thumbs-down',comment:'fa-comment-dots',share:'fa-share-from-square',search:'fa-magnifying-glass',edit:'fa-pen',bookmark:'fa-life-ring',heart:'fa-shrimp'}},
    {id:'retro',name:'Retro',desc:'80s throwback vibes.',price:1,preview:'linear-gradient(135deg,#ff6ec7,#7873f5)',icons:{home:'fa-tv',groups:'fa-compact-disc',skins:'fa-spray-can',profiles:'fa-user-secret',shop:'fa-record-vinyl',messages:'fa-phone',notifications:'fa-radio',like:'fa-thumbs-up',dislike:'fa-thumbs-down',comment:'fa-comments',share:'fa-share-nodes',search:'fa-magnifying-glass',edit:'fa-scissors',bookmark:'fa-floppy-disk',heart:'fa-gamepad'}},
    {id:'food',name:'Foodie',desc:'Tasty food-themed icons.',price:1,preview:'linear-gradient(135deg,#ff9a44,#fc6076)',icons:{home:'fa-house-chimney',groups:'fa-utensils',skins:'fa-ice-cream',profiles:'fa-mug-hot',shop:'fa-cart-shopping',messages:'fa-cookie-bite',notifications:'fa-lemon',like:'fa-thumbs-up',dislike:'fa-thumbs-down',comment:'fa-comment-dots',share:'fa-share-from-square',search:'fa-magnifying-glass',edit:'fa-pen',bookmark:'fa-pizza-slice',heart:'fa-candy-cane'}},
    {id:'weather',name:'Weather',desc:'Atmospheric sky icons.',price:1,preview:'linear-gradient(135deg,#89CFF0,#FFD700)',icons:{home:'fa-cloud-sun',groups:'fa-tornado',skins:'fa-rainbow',profiles:'fa-snowman',shop:'fa-umbrella',messages:'fa-snowflake',notifications:'fa-bolt-lightning',like:'fa-thumbs-up',dislike:'fa-thumbs-down',comment:'fa-comment-dots',share:'fa-wind',search:'fa-temperature-half',edit:'fa-droplet',bookmark:'fa-sun',heart:'fa-cloud-moon'}}
];

var coinSkins = [
    {id:'diamond',name:'Diamond',desc:'Sparkly diamond coins.',price:1,icon:'fa-gem',color:'#b9f2ff'},
    {id:'star',name:'Star',desc:'Shining star coins.',price:1,icon:'fa-star',color:'#ffd700'},
    {id:'crown',name:'Crown',desc:'Royal crown coins.',price:1,icon:'fa-crown',color:'#f5c518'},
    {id:'fire',name:'Fire',desc:'Blazing fire coins.',price:1,icon:'fa-fire',color:'#ff6b35'},
    {id:'bolt',name:'Bolt',desc:'Electric bolt coins.',price:1,icon:'fa-bolt',color:'#00d4ff'},
    {id:'heart',name:'Heart',desc:'Love-filled coins.',price:1,icon:'fa-heart',color:'#ff69b4'},
    {id:'shield',name:'Shield',desc:'Armored silver coins.',price:1,icon:'fa-shield-halved',color:'#a0aec0'},
    {id:'moon',name:'Moon',desc:'Lunar glow coins.',price:1,icon:'fa-moon',color:'#9b59b6'},
    {id:'leaf',name:'Leaf',desc:'Nature energy coins.',price:1,icon:'fa-leaf',color:'#27ae60'},
    {id:'snowflake',name:'Snowflake',desc:'Frosty ice coins.',price:1,icon:'fa-snowflake',color:'#74b9ff'}
];

var templates = [
    {id:'panorama',name:'Panorama',desc:'Profile banner spans full width. Two-column feed layout below.',price:1,preview:'linear-gradient(135deg,#ff6b6b,#ee5a24)'},
    {id:'compact',name:'Compact',desc:'Centered single-column layout. Everything stacked cleanly.',price:1,preview:'linear-gradient(135deg,#6c5ce7,#a29bfe)'},
    {id:'reverse',name:'Reverse',desc:'Flipped mirror layout. Feed on the right, sidebars swapped.',price:1,preview:'linear-gradient(135deg,#00b894,#00cec9)'},
    {id:'dashboard',name:'Dashboard',desc:'Both sidebars stacked on the left. Wide feed dominates the right.',price:1,preview:'linear-gradient(135deg,#fdcb6e,#e17055)'},
    {id:'cinema',name:'Cinema',desc:'Feed takes center stage full width. Sidebars tucked below.',price:1,preview:'linear-gradient(135deg,#2d3436,#636e72)'},
    {id:'magazine',name:'Magazine',desc:'Profile header up top. Three equal columns below like a news layout.',price:1,preview:'linear-gradient(135deg,#0984e3,#6c5ce7)'},
    {id:'zen',name:'Zen',desc:'Ultra minimal. Just your feed, nothing else. Pure focus mode.',price:1,preview:'linear-gradient(135deg,#dfe6e9,#b2bec3)'},
    {id:'spotlight',name:'Spotlight',desc:'Extra-wide feed, narrow sidebars. Content takes center stage.',price:1,preview:'linear-gradient(135deg,#f39c12,#e74c3c)'},
    {id:'widescreen',name:'Widescreen',desc:'No left sidebar. Feed and right sidebar fill the page.',price:1,preview:'linear-gradient(135deg,#2ecc71,#1abc9c)'},
    {id:'duo',name:'Duo',desc:'Clean two-column split. Profile left, feed right.',price:1,preview:'linear-gradient(135deg,#3498db,#2980b9)'},
    {id:'headline',name:'Headline',desc:'Profile spans the top like a newspaper masthead.',price:1,preview:'linear-gradient(135deg,#9b59b6,#8e44ad)'},
    {id:'stack',name:'Stack',desc:'Full-width stacked layout. Everything in one vertical flow.',price:1,preview:'linear-gradient(135deg,#e67e22,#d35400)'},
];

var navStyles = [
    {id:'metro',name:'Metro',desc:'App-style vertical sidebar nav. Completely reimagined layout.',price:1,preview:'linear-gradient(135deg,#1e272e,#485460)'},
    {id:'dock',name:'Dock',desc:'Mobile app-style bottom navigation dock with slim top header.',price:1,preview:'linear-gradient(135deg,#0f3460,#16213e)'},
    {id:'float',name:'Float',desc:'Floating glass navbar with rounded corners. Minimal and premium.',price:1,preview:'linear-gradient(135deg,#667eea,#764ba2)'},
    {id:'pill',name:'Pill',desc:'Floating pill at bottom center. Icons only. Ultra minimal.',price:1,preview:'linear-gradient(135deg,#e91e63,#9c27b0)'},
    {id:'rail',name:'Rail',desc:'Thin icon-only sidebar. Compact and space-efficient.',price:1,preview:'linear-gradient(135deg,#455a64,#263238)'},
    {id:'shelf',name:'Shelf',desc:'Double-row top bar with tabbed navigation row below.',price:1,preview:'linear-gradient(135deg,#00897b,#004d40)'},
    {id:'slim',name:'Slim',desc:'Ultra-thin 36px bar. Maximum content space.',price:1,preview:'linear-gradient(135deg,#5c6bc0,#283593)'},
    {id:'horizon',name:'Horizon',desc:'Full navbar moved to the bottom of the screen.',price:1,preview:'linear-gradient(135deg,#f4511e,#bf360c)'},
    {id:'mirror',name:'Mirror',desc:'Right-side vertical sidebar. Flipped Metro layout.',price:1,preview:'linear-gradient(135deg,#26a69a,#00695c)'},
    {id:'island',name:'Island',desc:'Three floating islands. Logo, nav, and user all separate.',price:1,preview:'linear-gradient(135deg,#42a5f5,#0d47a1)'}
];

var premiumSkins = [
    {id:'witchcraft',name:'Witchcraft',desc:'Mystical witch symbols with moonlit purple aura. Enchanting and magical.',price:1,preview:'linear-gradient(135deg,#2d1b69,#11001c)',border:'conic-gradient(from 0deg,#8b5cf6,#c084fc,#a855f7,#7c3aed,#8b5cf6)',icon:'fa-hat-wizard',iconColor:'#c084fc',accent:'#c084fc',accentHover:'#a855f7',dark:true},
    {id:'anime-blaze',name:'Anime Blaze',desc:'Fiery anime-inspired theme with blazing red and orange energy.',price:1,preview:'linear-gradient(135deg,#ff0844,#ffb199)',border:'conic-gradient(from 45deg,#ff0844,#ff6b6b,#ffb199,#ff0844)',icon:'fa-fire',iconColor:'#ff6b6b',accent:'#ff4444',accentHover:'#cc0033',dark:true},
    {id:'kawaii-cats',name:'Kawaii Cats',desc:'Adorable pink cat-themed design. Purrfectly cute for cat lovers.',price:1,preview:'linear-gradient(135deg,#fbc2eb,#a6c1ee)',border:'conic-gradient(from 0deg,#fbc2eb,#f8a4d2,#a6c1ee,#fbc2eb)',icon:'fa-cat',iconColor:'#f8a4d2',accent:'#e91e8c',accentHover:'#c2185b',dark:false},
    {id:'geo-prism',name:'Geo Prism',desc:'Sharp geometric shapes with prismatic rainbow refraction.',price:1,preview:'linear-gradient(135deg,#00c9ff,#92fe9d)',border:'conic-gradient(from 0deg,#ff0000,#ff8800,#ffff00,#00ff00,#0088ff,#8800ff,#ff0000)',icon:'fa-shapes',iconColor:'#00c9ff',accent:'#4f46e5',accentHover:'#4338ca',dark:false},
    {id:'autumn-leaves',name:'Autumn Leaves',desc:'Warm fall foliage tones. Golden amber and rustic reds.',price:1,preview:'linear-gradient(135deg,#f12711,#f5af19)',border:'conic-gradient(from 30deg,#f5af19,#f12711,#c0392b,#e67e22,#f5af19)',icon:'fa-leaf',iconColor:'#f5af19',accent:'#d35400',accentHover:'#b84500',dark:false},
    {id:'neon-wave',name:'Neon Wave',desc:'Electric neon gradient that pulses with cyberpunk energy.',price:1,preview:'linear-gradient(135deg,#00f5a0,#7b2ff7)',border:'conic-gradient(from 0deg,#00f5a0,#00d9f5,#7b2ff7,#f500e5,#00f5a0)',icon:'fa-bolt',iconColor:'#00f5a0',accent:'#00f5a0',accentHover:'#00cc88',dark:true},
    {id:'sakura',name:'Sakura Bloom',desc:'Delicate cherry blossom pink with soft floral elegance.',price:1,preview:'linear-gradient(135deg,#ffecd2,#fcb69f)',border:'conic-gradient(from 0deg,#fcb69f,#ff9a9e,#ffecd2,#f8b4b4,#fcb69f)',icon:'fa-spa',iconColor:'#ff9a9e',accent:'#e11d73',accentHover:'#be185d',dark:false},
    {id:'galaxy',name:'Galaxy Swirl',desc:'Deep space nebula with cosmic purples and stellar blues.',price:1,preview:'linear-gradient(135deg,#0c0032,#6e0dd0)',border:'conic-gradient(from 0deg,#6e0dd0,#240090,#0c0032,#3500d3,#6e0dd0)',icon:'fa-star',iconColor:'#b388ff',accent:'#a855f7',accentHover:'#9333ea',dark:true},
    {id:'ocean-tide',name:'Ocean Tide',desc:'Flowing ocean waves with deep aqua and seafoam gradients.',price:1,preview:'linear-gradient(135deg,#0077b6,#90e0ef)',border:'conic-gradient(from 0deg,#0077b6,#00b4d8,#90e0ef,#caf0f8,#0077b6)',icon:'fa-water',iconColor:'#90e0ef',accent:'#0891b2',accentHover:'#0e7490',dark:false},
    {id:'molten-gold',name:'Molten Gold',desc:'Liquid gold with luxurious metallic shimmer. Pure opulence.',price:1,preview:'linear-gradient(135deg,#bf953f,#fcf6ba)',border:'conic-gradient(from 0deg,#bf953f,#fcf6ba,#b38728,#fbf5b7,#bf953f)',icon:'fa-crown',iconColor:'#fcf6ba',accent:'#f59e0b',accentHover:'#d97706',dark:true}
];

var gfLink=document.createElement('link');gfLink.rel='stylesheet';gfLink.href='https://fonts.googleapis.com/css2?family=Orbitron&family=Rajdhani&family=Quicksand&family=Pacifico&family=Baloo+2&display=swap';document.head.appendChild(gfLink);

var msgContacts = [
    {id:1,name:'Sarah Miller',img:32,messages:[
        {from:'them',text:'Hey! Love your latest post!'},
        {from:'me',text:'Thanks Sarah! Means a lot'},
        {from:'them',text:'We should hang out sometime!'},
        {from:'me',text:'Definitely! Are you free this weekend?'},
        {from:'them',text:'Saturday works for me!'}
    ]},
    {id:2,name:'Mike Johnson',img:15,messages:[
        {from:'them',text:'Yo did you see the new game trailer??'},
        {from:'me',text:'YES it looks incredible'},
        {from:'them',text:'We gotta play it when it drops'},
        {from:'me',text:'Day one for sure'}
    ]},
    {id:3,name:'Emily Chen',img:25,messages:[
        {from:'them',text:'Those travel pics are amazing!'},
        {from:'me',text:'Thanks! You should come next time'},
        {from:'them',text:'I would love that!'}
    ]},
    {id:4,name:'James Wilson',img:11,messages:[
        {from:'me',text:'Hey James, cool art piece!'},
        {from:'them',text:'Thanks man! Took me 3 days'},
        {from:'me',text:'Totally worth it'}
    ]},
    {id:5,name:'Priya Sharma',img:60,messages:[
        {from:'them',text:'Can you share that recipe?'},
        {from:'me',text:'Of course! I will DM you the link'},
        {from:'them',text:'You are the best!'}
    ]}
];

// ======================== UTILITIES ========================
function $(sel){return document.querySelector(sel);}
function $$(sel){return document.querySelectorAll(sel);}
function fmtNum(n){return n>=1000?(n/1000).toFixed(1)+'k':n.toString();}
function timeAgo(i){
    var units=['just now','1 min ago','5 min ago','15 min ago','30 min ago','1 hr ago','2 hrs ago','3 hrs ago','5 hrs ago','8 hrs ago','12 hrs ago','1 day ago','2 days ago','3 days ago','5 days ago','1 week ago'];
    return units[i%units.length];
}

// ======================== NAVIGATION ========================
var _pvSaved=null;
function navigateTo(page){
    // Restore user's skin/font/template when leaving profile view
    if(_pvSaved&&page!=='profile-view'){
        applySkin(_pvSaved.skin||null,true);applyFont(_pvSaved.font||null,true);applyTemplate(_pvSaved.tpl||null,true);
        _pvSaved=null;
    }
    $$('.page').forEach(function(p){p.classList.remove('active');});
    var target=document.getElementById('page-'+page);
    if(target) target.classList.add('active');
    $$('.nav-link').forEach(function(l){l.classList.remove('active');});
    $$('.nav-link[data-page="'+page+'"]').forEach(function(l){l.classList.add('active');});
    $('#userDropdownMenu').classList.remove('show');
    window.scrollTo(0,0);
    if(page==='notifications'){
        state.notifications.forEach(function(n){n.read=true;});
        updateNotifBadge();
    }
    if(page==='shop') renderShop();
    if(page==='skins') renderMySkins();
    if(page==='photos') renderPhotoAlbum();
    if(page==='saved') renderSavedPage();
}

document.addEventListener('click',function(e){
    var link=e.target.closest('[data-page]');
    if(link){
        e.preventDefault();
        navigateTo(link.getAttribute('data-page'));
    }
    // Close dropdowns
    if(!e.target.closest('.post-menu-btn')&&!e.target.closest('.post-dropdown')){
        $$('.post-dropdown.show').forEach(function(m){m.classList.remove('show');});
    }
    if(!e.target.closest('.nav-user')){
        $('#userDropdownMenu').classList.remove('show');
    }
});

// User dropdown
$('#navUserDropdown').addEventListener('click',function(e){
    if(!e.target.closest('.user-dropdown a')) $('#userDropdownMenu').classList.toggle('show');
});

// Global search - open search results page on Enter
$('#globalSearch').addEventListener('keydown',function(e){
    if(e.key==='Enter'){
        var q=this.value.trim();
        if(q.length>0) performSearch(q);
    }
});

var currentSearchQuery='';
var currentSearchTab='people';

function performSearch(q){
    currentSearchQuery=q;
    currentSearchTab='people';
    navigateTo('search');
    $('#searchQuery').textContent='Results for "'+q+'"';
    // Update tab active states
    $$('.search-tab').forEach(function(t){t.classList.toggle('active',t.dataset.tab==='people');});
    renderSearchResults(q,'people');
}

// Search tab clicks
document.addEventListener('click',function(e){
    var tab=e.target.closest('.search-tab');
    if(tab && currentSearchQuery){
        currentSearchTab=tab.dataset.tab;
        $$('.search-tab').forEach(function(t){t.classList.remove('active');});
        tab.classList.add('active');
        renderSearchResults(currentSearchQuery,currentSearchTab);
    }
});

function renderSearchResults(q,tab){
    var ql=q.toLowerCase();
    var container=$('#searchResults');
    var html='';

    // Count results for each tab
    var peopleResults=people.filter(function(p){return p.name.toLowerCase().indexOf(ql)!==-1||p.bio.toLowerCase().indexOf(ql)!==-1;});
    var groupResults=groups.filter(function(g){return g.name.toLowerCase().indexOf(ql)!==-1||g.desc.toLowerCase().indexOf(ql)!==-1;});
    // Search posts by text content and tags
    var postResults=[];
    for(var i=0;i<100;i++){
        var text=postTexts[i%postTexts.length].toLowerCase();
        var tags=tagSets[i%tagSets.length];
        var tagMatch=tags.some(function(t){return t.toLowerCase().indexOf(ql)!==-1;});
        if(text.indexOf(ql)!==-1||tagMatch) postResults.push(i);
    }

    // Update tab counts
    $$('.search-tab').forEach(function(t){
        var count=0;
        if(t.dataset.tab==='people') count=peopleResults.length;
        else if(t.dataset.tab==='groups') count=groupResults.length;
        else if(t.dataset.tab==='posts') count=postResults.length;
        var badge=t.querySelector('.tab-count');
        if(badge) badge.textContent=count;
        else{var sp=document.createElement('span');sp.className='tab-count';sp.textContent=count;t.appendChild(sp);}
    });

    if(tab==='people'){
        if(!peopleResults.length){html='<div class="empty-state"><i class="fas fa-user-slash"></i><p>No people found for "'+q+'"</p></div>';}
        else{html='<div class="search-results-grid">';peopleResults.forEach(function(p){html+=profileCardHtml(p);});html+='</div>';}
        container.innerHTML=html;
        bindProfileEvents('#searchResults');
    } else if(tab==='groups'){
        if(!groupResults.length){html='<div class="empty-state"><i class="fas fa-users-slash"></i><p>No groups found for "'+q+'"</p></div>';}
        else{html='<div class="search-results-grid">';groupResults.forEach(function(g){html+=groupCardHtml(g);});html+='</div>';}
        container.innerHTML=html;
        bindGroupEvents('#searchResults');
    } else if(tab==='posts'){
        if(!postResults.length){html='<div class="empty-state"><i class="fas fa-file-circle-xmark"></i><p>No posts found for "'+q+'"</p></div>';}
        else{
            postResults.forEach(function(i){
                var person=people[i%people.length];
                var text=postTexts[i%postTexts.length];
                var tags=tagSets[i%tagSets.length];
                var badge=badgeTypes[i%badgeTypes.length];
                var short=text.substring(0,200);
                var rest=text.substring(200);
                var hasMore=rest.length>0;
                html+='<div class="card feed-post search-post-card">';
                html+='<div class="post-header"><img src="https://i.pravatar.cc/50?img='+person.img+'" alt="'+person.name+'" class="post-avatar" data-person-id="'+person.id+'">';
                html+='<div class="post-user-info"><div class="post-user-top"><h4 class="post-username" data-person-id="'+person.id+'">'+person.name+'</h4><span class="post-time">'+timeAgo(i)+'</span></div>';
                html+='<div class="post-badges"><span class="badge '+badge.cls+'"><i class="fas '+badge.icon+'"></i> '+badge.text+'</span></div></div></div>';
                html+='<div class="post-description"><p>'+short+(hasMore?'<span class="view-more-text hidden">'+rest+'</span>':'')+'</p>'+(hasMore?'<button class="view-more-btn">view more</button>':'')+'</div>';
                html+='<div class="post-tags">';
                tags.forEach(function(t){html+='<span class="skill-tag">'+t+'</span>';});
                html+='</div></div>';
            });
        }
        container.innerHTML=html;
        // Bind view more buttons in search results
        $$('#searchResults .view-more-btn').forEach(function(btn){
            btn.addEventListener('click',function(){
                var span=btn.parentElement.querySelector('.view-more-text');
                if(span.classList.contains('hidden')){span.classList.remove('hidden');btn.textContent='view less';}
                else{span.classList.add('hidden');btn.textContent='view more';}
            });
        });
        // Bind username clicks to profile view
        $$('#searchResults .post-username, #searchResults .post-avatar').forEach(function(el){
            el.addEventListener('click',function(){
                var p=people.find(function(x){return x.id===parseInt(el.dataset.personId);});
                if(p) showProfileView(p);
            });
        });
    }
}

// ======================== COIN SYSTEM ========================
function updateCoins(){
    $('#navCoinCount').textContent=state.coins;
    var el=$('#navCoins');
    el.classList.remove('coin-pop');
    void el.offsetWidth;
    el.classList.add('coin-pop');
}
$('#navCoins').addEventListener('click',function(){
    showModal('<div class="modal-header"><h3>Earn Coins</h3><button class="modal-close"><i class="fas fa-times"></i></button></div><div class="modal-body"><p style="text-align:center;margin-bottom:16px;font-size:14px;color:var(--gray);">Interact to earn coins. Spend them in the Skin Shop!</p><div class="coin-rules" style="flex-direction:column;align-items:center;gap:10px;display:flex;"><div class="coin-rule"><i class="fas fa-thumbs-up"></i><span>Like a post <strong>+1</strong></span></div><div class="coin-rule"><i class="fas fa-comment"></i><span>Comment <strong>+2</strong></span></div><div class="coin-rule"><i class="fas fa-pen-to-square"></i><span>Create a post <strong>+5</strong></span></div></div><p style="text-align:center;margin-top:16px;font-size:20px;font-weight:700;color:var(--primary);">'+state.coins+' Coins</p></div>');
});

// ======================== FOLLOW SYSTEM ========================
function updateFollowCounts(){
    $('#followingCount').textContent=state.following;
    $('#followersCount').textContent=state.followers;
}

function updateStatClickable(){
    var priv=state.privateFollowers;
    $('#followingStat').style.opacity=priv?'.5':'';
    $('#followingStat').style.pointerEvents=priv?'none':'';
    $('#followersStat').style.opacity=priv?'.5':'';
    $('#followersStat').style.pointerEvents=priv?'none':'';
}

function toggleFollow(userId,btn){
    if(blockedUsers[userId]){showToast('Cannot follow a blocked user');return;}
    if(state.followedUsers[userId]){
        delete state.followedUsers[userId];
        state.following--;
        if(btn){
            btn.classList.remove('followed');
            if(btn.classList.contains('follow-btn-small')){
                btn.innerHTML='<i class="fas fa-plus"></i>';
            } else {
                btn.innerHTML='<i class="fas fa-plus"></i> Follow';
                btn.classList.remove('btn-disabled');
                btn.classList.add('btn-green');
            }
        }
    } else {
        state.followedUsers[userId]=true;
        state.following++;
        if(btn){
            btn.classList.add('followed');
            if(btn.classList.contains('follow-btn-small')){
                btn.innerHTML='<i class="fas fa-check"></i>';
            } else {
                btn.innerHTML='<i class="fas fa-check"></i> Following';
                btn.classList.remove('btn-green');
                btn.classList.add('btn-disabled');
            }
        }
        addNotification('follow','You are now following '+people.find(function(p){return p.id===userId;}).name);
    }
    updateFollowCounts();
    renderSuggestions();
}

// ======================== NOTIFICATIONS ========================
function addNotification(type,text){
    state.notifications.unshift({type:type,text:text,time:new Date().toLocaleTimeString(),read:false});
    updateNotifBadge();
    renderNotifications();
}
function updateNotifBadge(){
    var unread=state.notifications.filter(function(n){return !n.read;}).length;
    var badge=$('#notifBadge');
    if(unread>0){badge.style.display='flex';badge.textContent=unread;}
    else{badge.style.display='none';}
}
function renderNotifications(){
    var container=$('#notifList');
    if(state.notifications.length===0){
        container.innerHTML='<div class="empty-state"><i class="fas fa-bell-slash"></i><p>No notifications yet.</p></div>';
        return;
    }
    var html='';
    state.notifications.forEach(function(n){
        var iconCls=n.type==='skin'?'skin':n.type==='follow'?'follow':n.type==='group'?'group':'coin';
        var iconI=n.type==='skin'?'fa-palette':n.type==='follow'?'fa-user-plus':n.type==='group'?'fa-users':'fa-coins';
        html+='<div class="notif-item"><div class="notif-icon '+iconCls+'"><i class="fas '+iconI+'"></i></div><div class="notif-text"><p>'+n.text+'</p><span>'+n.time+'</span></div></div>';
    });
    container.innerHTML=html;
}

// ======================== MODAL ========================
function showModal(html){
    $('#modalContent').innerHTML=html;
    $('#modalOverlay').classList.add('show');
}
function closeModal(){
    $('#modalOverlay').classList.remove('show');
}
$('#modalOverlay').addEventListener('click',function(e){
    if(e.target===this) closeModal();
});
document.addEventListener('click',function(e){
    if(e.target.closest('.modal-close')) closeModal();
});

function handleShare(btn){
    var post=btn.closest('.feed-post')||btn.closest('.card');
    if(!post)return;
    var avatar=post.querySelector('.post-avatar');
    var username=post.querySelector('.post-username');
    var time=post.querySelector('.post-time');
    var desc=post.querySelector('.post-description');
    var origAvatar=avatar?avatar.src:'';
    var origName=username?username.textContent:'Unknown';
    var origTime=time?time.textContent:'';
    var origText=desc?desc.innerHTML:'';
    var html='<div class="modal-header"><h3>Share Post</h3><button class="modal-close"><i class="fas fa-times"></i></button></div>';
    html+='<div class="modal-body"><textarea id="shareComment" placeholder="Add your thoughts..." style="width:100%;min-height:60px;border:1px solid var(--border);border-radius:8px;padding:10px;font-size:14px;resize:vertical;margin-bottom:12px;font-family:inherit;background:var(--light-bg);color:var(--dark);"></textarea>';
    html+='<div style="border:1px solid var(--border);border-radius:8px;padding:12px;background:var(--light-bg);">';
    html+='<div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;"><img src="'+origAvatar+'" style="width:28px;height:28px;border-radius:50%;"><strong style="font-size:13px;">'+origName+'</strong><span style="color:var(--gray);font-size:12px;">'+origTime+'</span></div>';
    html+='<div style="font-size:13px;color:var(--gray);">'+origText+'</div></div>';
    html+='<button id="sharePublishBtn" class="btn btn-primary" style="width:100%;margin-top:12px;">Share</button></div>';
    showModal(html);
    document.getElementById('sharePublishBtn').addEventListener('click',function(){
        var comment=document.getElementById('shareComment').value.trim();
        var container=$('#feedContainer');
        var postId='share-'+Date.now();
        var ph='<div class="card feed-post"><div class="post-header"><img src="https://i.pravatar.cc/50?img=12" alt="You" class="post-avatar">';
        ph+='<div class="post-user-info"><div class="post-user-top"><h4 class="post-username">John Doe</h4><span class="post-time">just now</span></div>';
        ph+='<div class="post-badges"><span class="badge badge-green"><i class="fas fa-share"></i> Shared</span></div></div></div>';
        if(comment) ph+='<div class="post-description"><p>'+comment.replace(/</g,'&lt;').replace(/>/g,'&gt;')+'</p></div>';
        ph+='<div style="border:1px solid var(--border);border-radius:8px;padding:12px;margin:0 0 14px;background:var(--light-bg);">';
        ph+='<div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;"><img src="'+origAvatar+'" style="width:28px;height:28px;border-radius:50%;"><strong style="font-size:13px;">'+origName+'</strong><span style="color:var(--gray);font-size:12px;">'+origTime+'</span></div>';
        ph+='<div style="font-size:13px;color:var(--gray);">'+origText+'</div></div>';
        ph+='<div class="post-actions"><div class="action-left"><button class="action-btn like-btn" data-post-id="'+postId+'"><i class="far '+activeIcons.like+'"></i><span class="like-count">0</span></button>';
        ph+='<button class="action-btn dislike-btn" data-post-id="'+postId+'"><i class="far '+activeIcons.dislike+'"></i><span class="dislike-count">0</span></button>';
        ph+='<button class="action-btn comment-btn"><i class="far '+activeIcons.comment+'"></i><span>0</span></button>';
        ph+='<button class="action-btn share-btn"><i class="fas '+activeIcons.share+'"></i><span>0</span></button></div></div></div>';
        container.insertAdjacentHTML('afterbegin',ph);
        state.coins+=5;updateCoins();
        closeModal();
        var countEl=btn.querySelector('span');if(countEl)countEl.textContent=parseInt(countEl.textContent)+1;
        var np=container.firstElementChild;
        var lb=np.querySelector('.like-btn');
        lb.addEventListener('click',function(){var c=lb.querySelector('.like-count');var n=parseInt(c.textContent);var pid=lb.getAttribute('data-post-id');if(state.likedPosts[pid]){delete state.likedPosts[pid];lb.classList.remove('liked');lb.querySelector('i').className='far '+activeIcons.like;c.textContent=n-1;state.coins--;updateCoins();}else{state.likedPosts[pid]=true;lb.classList.add('liked');lb.querySelector('i').className='fas '+activeIcons.like;c.textContent=n+1;state.coins++;updateCoins();}});
        var db=np.querySelector('.dislike-btn');
        db.addEventListener('click',function(){var c=db.querySelector('.dislike-count');var n=parseInt(c.textContent);var pid=db.getAttribute('data-post-id');if(state.dislikedPosts[pid]){delete state.dislikedPosts[pid];db.classList.remove('disliked');db.querySelector('i').className='far '+activeIcons.dislike;c.textContent=n-1;}else{state.dislikedPosts[pid]=true;db.classList.add('disliked');db.querySelector('i').className='fas '+activeIcons.dislike;c.textContent=n+1;}});
        np.querySelector('.comment-btn').addEventListener('click',function(){showComments(postId,np.querySelector('.comment-btn span'));});
        np.querySelector('.share-btn').addEventListener('click',function(){handleShare(np.querySelector('.share-btn'));});
    });
}

function buildCommentHtml(cid,name,img,text,likes,isReply){
    var liked=likedComments[cid];var lc=likes+(liked?1:0);
    var disliked=dislikedComments[cid];var dc=disliked?1:0;
    var avatarSrc=img?('https://i.pravatar.cc/32?img='+img):$('#profileAvatarImg').src;
    var sz=isReply?'28':'32';
    var h='<div class="comment-item'+(isReply?' comment-reply':'')+'" data-cid="'+cid+'">';
    h+='<img src="'+avatarSrc+'" style="width:'+sz+'px;height:'+sz+'px;border-radius:50%;flex-shrink:0;">';
    h+='<div style="flex:1;"><strong style="font-size:13px;">'+name+'</strong>';
    h+='<p style="font-size:13px;color:#555;margin-top:2px;">'+text+'</p>';
    h+='<div class="comment-actions-row" style="display:flex;gap:10px;margin-top:4px;">';
    h+='<button class="comment-like-btn" data-cid="'+cid+'" style="background:none;font-size:12px;color:'+(liked?'var(--primary)':'#999')+';display:flex;align-items:center;gap:4px;"><i class="'+(liked?'fas':'far')+' fa-thumbs-up"></i><span>'+lc+'</span></button>';
    h+='<button class="comment-dislike-btn" data-cid="'+cid+'" style="background:none;font-size:12px;color:'+(disliked?'var(--primary)':'#999')+';display:flex;align-items:center;gap:4px;"><i class="'+(disliked?'fas':'far')+' fa-thumbs-down"></i><span>'+dc+'</span></button>';
    h+='<button class="comment-reply-btn" data-cid="'+cid+'" style="background:none;font-size:12px;color:#999;cursor:pointer;"><i class="far fa-comment"></i> Reply</button>';
    h+='</div></div></div>';
    return h;
}

function getRepliesForComment(parentCid){return commentReplies[parentCid]||[];}
function getRootParent(cid){
    // Walk up to find the original top-level parent
    var replies=Object.keys(commentReplies);
    for(var i=0;i<replies.length;i++){
        var arr=commentReplies[replies[i]];
        for(var j=0;j<arr.length;j++){if(arr[j].cid===cid)return getRootParent(replies[i]);}
    }
    return cid;
}

function renderCommentThread(cid,name,img,text,likes,showAllReplies){
    var h=buildCommentHtml(cid,name,img,text,likes,false);
    var replies=getRepliesForComment(cid);
    var visibleReplies=showAllReplies?replies:replies.slice(0,2);
    visibleReplies.forEach(function(r){h+=buildCommentHtml(r.cid,r.name,r.img,r.text,0,true);});
    if(!showAllReplies&&replies.length>2) h+='<a href="#" class="view-more-replies" data-parent="'+cid+'" style="font-size:12px;color:var(--primary);margin-left:42px;display:block;margin-bottom:8px;">View more replies ('+replies.length+')</a>';
    return h;
}

function showComments(postId,countEl,sortMode){
    sortMode=sortMode||settings.commentOrder||'top';
    var gen=getComments(postId);
    var user=state.comments[postId]||[];
    var allComments=[];
    gen.forEach(function(c,i){allComments.push({cid:postId+'-g-'+i,name:c.person.name,img:c.person.img,text:c.text,likes:c.likes});});
    user.forEach(function(t,i){allComments.push({cid:postId+'-u-'+i,name:'John Doe',img:null,text:t,likes:0});});
    if(sortMode==='top'){allComments.sort(function(a,b){return b.likes-a.likes;});}
    else if(sortMode==='newest'){allComments.reverse();}
    var tabsHtml='<div class="search-tabs" style="margin-bottom:12px;">';
    tabsHtml+='<button class="search-tab comment-sort-tab'+(sortMode==='top'?' active':'')+'" data-sort="top">Top Comments</button>';
    tabsHtml+='<button class="search-tab comment-sort-tab'+(sortMode==='newest'?' active':'')+'" data-sort="newest">Newest</button>';
    tabsHtml+='<button class="search-tab comment-sort-tab'+(sortMode==='oldest'?' active':'')+'" data-sort="oldest">Oldest</button>';
    tabsHtml+='</div>';
    var html='<div class="modal-header"><h3>Comments</h3><button class="modal-close"><i class="fas fa-times"></i></button></div><div class="modal-body">'+tabsHtml+'<div id="commentsList">';
    if(!allComments.length) html+='<p style="color:#777;margin-bottom:12px;" id="noCommentsMsg">No comments yet.</p>';
    allComments.forEach(function(c){html+=renderCommentThread(c.cid,c.name,c.img,c.text,c.likes,false);});
    html+='</div><div style="display:flex;gap:10px;margin-top:12px;"><input type="text" class="post-input" id="commentInput" placeholder="Write a comment..." style="flex:1;"><button class="btn btn-primary" id="postCommentBtn">Post</button></div><div id="replyIndicator" style="display:none;font-size:12px;color:var(--primary);margin-top:4px;">Replying to <span id="replyToName"></span> <button id="cancelReply" style="background:none;color:#999;font-size:12px;margin-left:8px;cursor:pointer;">Cancel</button></div></div>';
    showModal(html);
    bindCommentLikes();
    var replyTarget=null;
    // Tab click handlers
    $$('.comment-sort-tab').forEach(function(tab){
        tab.addEventListener('click',function(){showComments(postId,countEl,tab.dataset.sort);});
    });
    // Bind reply buttons helper
    function bindReplyBtns(){
        $$('.comment-reply-btn').forEach(function(btn){
            if(btn._bound)return;btn._bound=true;
            btn.addEventListener('click',function(){
                var cid=btn.dataset.cid;
                replyTarget=getRootParent(cid);
                var item=btn.closest('.comment-item');
                var name=item?item.querySelector('strong').textContent:'';
                document.getElementById('replyIndicator').style.display='block';
                document.getElementById('replyToName').textContent=name;
                document.getElementById('commentInput').placeholder='Reply to '+name+'...';
                document.getElementById('commentInput').focus();
            });
        });
    }
    // View more replies — expand inline
    $$('.view-more-replies').forEach(function(link){
        link.addEventListener('click',function(e){
            e.preventDefault();
            var parentCid=link.dataset.parent;
            var replies=getRepliesForComment(parentCid);
            var extraHtml='';
            replies.slice(2).forEach(function(r){extraHtml+=buildCommentHtml(r.cid,r.name,r.img,r.text,0,true);});
            link.insertAdjacentHTML('beforebegin',extraHtml);
            link.remove();
            bindCommentLikes();
            bindReplyBtns();
        });
    });
    bindReplyBtns();
    document.getElementById('cancelReply').addEventListener('click',function(){
        replyTarget=null;
        document.getElementById('replyIndicator').style.display='none';
        document.getElementById('commentInput').placeholder='Write a comment...';
    });
    document.getElementById('postCommentBtn').addEventListener('click',function(){
        var input=document.getElementById('commentInput');var text=input.value.trim();if(!text)return;
        if(replyTarget){
            if(!commentReplies[replyTarget])commentReplies[replyTarget]=[];
            var rid=replyTarget+'-r-'+commentReplies[replyTarget].length;
            commentReplies[replyTarget].push({cid:rid,name:'John Doe',img:null,text:text});
            state.coins+=2;updateCoins();
            replyTarget=null;
            document.getElementById('replyIndicator').style.display='none';
            input.placeholder='Write a comment...';
        }else{
            if(!state.comments[postId])state.comments[postId]=[];
            state.comments[postId].push(text);state.coins+=2;updateCoins();
        }
        input.value='';if(countEl)countEl.textContent=parseInt(countEl.textContent)+1;
        renderInlineComments(postId);
        showComments(postId,countEl,sortMode);
    });
    document.getElementById('commentInput').addEventListener('keypress',function(e){if(e.key==='Enter')document.getElementById('postCommentBtn').click();});
}

function bindCommentLikes(){
    $$('.comment-like-btn').forEach(function(btn){
        btn.onclick=function(){
            var cid=btn.dataset.cid;var span=btn.querySelector('span');var ct=parseInt(span.textContent);
            var disBtn=btn.closest('.comment-actions-row')?btn.closest('.comment-actions-row').querySelector('.comment-dislike-btn'):btn.parentNode.querySelector('.comment-dislike-btn');
            if(likedComments[cid]){delete likedComments[cid];ct--;btn.style.color='#999';btn.querySelector('i').className='far fa-thumbs-up';}
            else{
                if(dislikedComments[cid]&&disBtn){delete dislikedComments[cid];var ds=disBtn.querySelector('span');ds.textContent=parseInt(ds.textContent)-1;disBtn.style.color='#999';disBtn.querySelector('i').className='far fa-thumbs-down';}
                likedComments[cid]=true;ct++;btn.style.color='var(--primary)';btn.querySelector('i').className='fas fa-thumbs-up';
                if(!commentCoinAwarded[cid]){commentCoinAwarded[cid]=true;state.coins+=1;updateCoins();}
            }
            span.textContent=ct;
        };
    });
    $$('.comment-dislike-btn').forEach(function(btn){
        btn.onclick=function(){
            var cid=btn.dataset.cid;var span=btn.querySelector('span');var ct=parseInt(span.textContent);
            var likeBtn=btn.closest('.comment-actions-row')?btn.closest('.comment-actions-row').querySelector('.comment-like-btn'):btn.parentNode.querySelector('.comment-like-btn');
            if(dislikedComments[cid]){delete dislikedComments[cid];ct--;btn.style.color='#999';btn.querySelector('i').className='far fa-thumbs-down';}
            else{
                if(likedComments[cid]&&likeBtn){delete likedComments[cid];var ls=likeBtn.querySelector('span');ls.textContent=parseInt(ls.textContent)-1;likeBtn.style.color='#999';likeBtn.querySelector('i').className='far fa-thumbs-up';}
                dislikedComments[cid]=true;ct++;btn.style.color='var(--primary)';btn.querySelector('i').className='fas fa-thumbs-down';
                if(!commentCoinAwarded[cid]){commentCoinAwarded[cid]=true;state.coins+=1;updateCoins();}
            }
            span.textContent=ct;
        };
    });
}

function renderInlineComments(postId){
    var el=document.querySelector('.post-comments[data-post-id="'+postId+'"]');
    if(!el)return;
    var gen=getComments(postId);
    var user=state.comments[postId]||[];
    var all=gen.map(function(c,i){return{name:c.person.name,img:c.person.img,text:c.text,likes:c.likes,cid:postId+'-g-'+i};});
    user.forEach(function(t,i){all.push({name:'John Doe',img:null,text:t,likes:0,cid:postId+'-u-'+i});});
    if(!all.length){el.innerHTML='';el.style.padding='';return;}
    var shown=all.slice(0,3);
    var html='';
    shown.forEach(function(c){
        var liked=likedComments[c.cid];var lc=c.likes+(liked?1:0);
        var disliked=dislikedComments[c.cid];var dc=disliked?1:0;
        var avatarSrc=c.img?'https://i.pravatar.cc/24?img='+c.img:$('#profileAvatarImg').src;
        html+='<div class="inline-comment"><img src="'+avatarSrc+'" class="inline-comment-avatar"><div><div class="inline-comment-bubble"><strong style="font-size:12px;">'+c.name+'</strong> <span style="font-size:12px;color:#555;">'+c.text+'</span></div><div style="display:flex;gap:8px;margin-top:2px;margin-left:4px;"><button class="inline-comment-like" data-cid="'+c.cid+'" style="background:none;font-size:11px;color:'+(liked?'var(--primary)':'#999')+';display:flex;align-items:center;gap:3px;"><i class="'+(liked?'fas':'far')+' fa-thumbs-up"></i>'+lc+'</button><button class="inline-comment-dislike" data-cid="'+c.cid+'" style="background:none;font-size:11px;color:'+(disliked?'var(--primary)':'#999')+';display:flex;align-items:center;gap:3px;"><i class="'+(disliked?'fas':'far')+' fa-thumbs-down"></i>'+dc+'</button><button class="inline-comment-reply" data-cid="'+c.cid+'" style="background:none;font-size:11px;color:#999;cursor:pointer;"><i class="far fa-comment"></i> Reply</button></div></div></div>';
        var replies=getRepliesForComment(c.cid);
        if(replies.length) html+='<a href="#" class="show-more-replies-inline" data-postid="'+postId+'" style="font-size:11px;color:var(--primary);display:block;margin-left:34px;margin-bottom:6px;">View replies ('+replies.length+')</a>';
    });
    if(all.length>3) html+='<a href="#" class="show-more-comments" style="font-size:12px;color:var(--primary);display:block;margin-top:4px;">See all comments ('+all.length+')</a>';
    el.style.padding='0 20px 14px';el.innerHTML=html;
    el.querySelectorAll('.inline-comment-like').forEach(function(btn){
        btn.onclick=function(e){
            e.stopPropagation();var cid=btn.dataset.cid;var liked=likedComments[cid];
            var gen=getComments(postId);var base=0;
            gen.forEach(function(c,i){if(postId+'-g-'+i===cid)base=c.likes;});
            var disBtn=btn.parentNode.querySelector('.inline-comment-dislike');
            if(liked){delete likedComments[cid];btn.style.color='#999';btn.querySelector('i').className='far fa-thumbs-up';btn.lastChild.textContent=base;}
            else{
                if(dislikedComments[cid]&&disBtn){delete dislikedComments[cid];disBtn.style.color='#999';disBtn.querySelector('i').className='far fa-thumbs-down';disBtn.lastChild.textContent=0;}
                likedComments[cid]=true;btn.style.color='var(--primary)';btn.querySelector('i').className='fas fa-thumbs-up';btn.lastChild.textContent=base+1;
                if(!commentCoinAwarded[cid]){commentCoinAwarded[cid]=true;state.coins+=1;updateCoins();}
            }
        };
    });
    el.querySelectorAll('.inline-comment-dislike').forEach(function(btn){
        btn.onclick=function(e){
            e.stopPropagation();var cid=btn.dataset.cid;var disliked=dislikedComments[cid];
            var likeBtn=btn.parentNode.querySelector('.inline-comment-like');
            if(disliked){delete dislikedComments[cid];btn.style.color='#999';btn.querySelector('i').className='far fa-thumbs-down';btn.lastChild.textContent=0;}
            else{
                if(likedComments[cid]&&likeBtn){delete likedComments[cid];var gen2=getComments(postId);var base2=0;gen2.forEach(function(c,i){if(postId+'-g-'+i===cid)base2=c.likes;});likeBtn.style.color='#999';likeBtn.querySelector('i').className='far fa-thumbs-up';likeBtn.lastChild.textContent=base2;}
                dislikedComments[cid]=true;btn.style.color='var(--primary)';btn.querySelector('i').className='fas fa-thumbs-down';btn.lastChild.textContent=1;
                if(!commentCoinAwarded[cid]){commentCoinAwarded[cid]=true;state.coins+=1;updateCoins();}
            }
        };
    });
    el.querySelectorAll('.inline-comment-reply').forEach(function(btn){
        btn.onclick=function(e){
            e.stopPropagation();
            showComments(postId,el.closest('.feed-post').querySelector('.comment-btn span'));
            // Trigger reply to this comment after modal opens
            setTimeout(function(){
                var rb=document.querySelector('.comment-reply-btn[data-cid="'+btn.dataset.cid+'"]');
                if(rb)rb.click();
            },100);
        };
    });
    var link=el.querySelector('.show-more-comments');
    if(link)link.addEventListener('click',function(e){e.preventDefault();showComments(postId,el.closest('.feed-post').querySelector('.comment-btn span'));});
    el.querySelectorAll('.show-more-replies-inline').forEach(function(link){
        link.addEventListener('click',function(e){e.preventDefault();showComments(postId,el.closest('.feed-post').querySelector('.comment-btn span'));});
    });
}

function showProfileModal(person){
    var isFollowed=state.followedUsers[person.id];
    var html='<div class="modal-header"><h3>Profile</h3><button class="modal-close"><i class="fas fa-times"></i></button></div>';
    html+='<div class="modal-body"><div class="modal-profile-top"><img src="https://i.pravatar.cc/80?img='+person.img+'" alt="'+person.name+'"><h3>'+person.name+'</h3><p>'+person.bio+'</p></div>';
    html+='<div class="modal-profile-stats"><div class="stat"><span class="stat-count">'+Math.floor(Math.random()*500)+'</span><span class="stat-label">Following</span></div><div class="stat"><span class="stat-count">'+Math.floor(Math.random()*2000)+'</span><span class="stat-label">Followers</span></div></div>';
    html+='<div class="modal-actions"><button class="btn '+(isFollowed?'btn-disabled':'btn-green')+'" id="modalFollowBtn" data-uid="'+person.id+'">'+(isFollowed?'<i class="fas fa-check"></i> Following':'<i class="fas fa-plus"></i> Follow')+'</button>';
    html+='<button class="btn btn-primary" id="modalMsgBtn" data-uid="'+person.id+'"><i class="fas fa-envelope"></i> Message</button>';
    html+='<button class="btn btn-outline" id="modalViewProfileBtn"><i class="fas fa-user"></i> View Profile</button>';
    html+='<button class="btn btn-outline" id="modalBlockBtn" data-uid="'+person.id+'" style="color:#e74c3c;border-color:#e74c3c;">'+(blockedUsers[person.id]?'<i class="fas fa-unlock"></i> Unblock':'<i class="fas fa-ban"></i> Block')+'</button></div>';
    var recs=getRankedSuggestions(5).filter(function(p){return p.id!==person.id&&!blockedUsers[p.id];});
    if(recs.length){
        html+='<div style="margin-top:16px;"><h4 style="font-size:14px;font-weight:600;margin-bottom:8px;"><i class="fas fa-user-plus" style="color:var(--primary);margin-right:6px;"></i>People You May Know</h4>';
        html+='<div class="suggestion-list" id="modalSuggestScroll">';
        recs.forEach(function(p){
            var followed=state.followedUsers[p.id];
            html+='<div class="suggestion-item"><img src="https://i.pravatar.cc/40?img='+p.img+'" alt="'+p.name+'" class="suggestion-avatar">';
            html+='<div class="suggestion-info"><span class="suggestion-name" data-person-id="'+p.id+'">'+p.name+'</span></div>';
            html+='<button class="follow-btn-small'+(followed?' followed':'')+'" data-uid="'+p.id+'">'+(followed?'<i class="fas fa-check"></i>':'<i class="fas fa-plus"></i>')+'</button></div>';
        });
        html+='</div></div>';
    }
    html+='</div>';
    showModal(html);
    $$('#modalSuggestScroll .follow-btn-small').forEach(function(btn){btn.addEventListener('click',function(){toggleFollow(parseInt(btn.dataset.uid),btn);});});
    $$('#modalSuggestScroll .suggestion-name').forEach(function(el){el.addEventListener('click',function(){var p=people.find(function(x){return x.id===parseInt(el.dataset.personId);});if(p)showProfileModal(p);});});
    document.getElementById('modalFollowBtn').addEventListener('click',function(){
        toggleFollow(person.id,this);
    });
    document.getElementById('modalMsgBtn').addEventListener('click',function(){
        closeModal();
        navigateTo('messages');
        var existing=msgContacts.find(function(c){return c.name===person.name;});
        if(!existing){
            existing={id:msgContacts.length+1,name:person.name,img:person.img,messages:[{from:'me',text:'Hey '+person.name+'!'}]};
            msgContacts.push(existing);
            renderMsgContacts();
        }
        openChat(existing);
    });
    document.getElementById('modalViewProfileBtn').addEventListener('click',function(){
        closeModal();
        showProfileView(person);
    });
    document.getElementById('modalBlockBtn').addEventListener('click',function(){
        if(blockedUsers[person.id]){
            unblockUser(person.id);
            closeModal();
            showProfileModal(person);
        } else {
            showBlockConfirmModal(person);
        }
    });
}

function showMyProfileModal(){
    var html='<div class="modal-header"><h3>My Profile</h3><button class="modal-close"><i class="fas fa-times"></i></button></div>';
    html+='<div class="modal-body"><div class="modal-profile-top"><img src="https://i.pravatar.cc/80?img=12" alt="John Doe"><h3>John Doe</h3><p>Living my best life</p></div>';
    html+='<div class="modal-profile-stats"><div class="stat"><span class="stat-count">'+state.following+'</span><span class="stat-label">Following</span></div><div class="stat"><span class="stat-count">'+state.followers+'</span><span class="stat-label">Followers</span></div></div>';
    html+='<div style="text-align:center;"><p style="color:#777;font-size:13px;">Active Skin: '+(state.activeSkin?skins.find(function(s){return s.id===state.activeSkin;}).name:'Default')+'</p></div>';
    html+='<div class="modal-actions" style="margin-top:16px;"><button class="btn btn-outline" id="modalViewMyProfileBtn"><i class="fas fa-user"></i> View Profile</button></div></div>';
    showModal(html);
    document.getElementById('modalViewMyProfileBtn').addEventListener('click',function(){
        closeModal();
        showProfileView({id:0,name:'John Doe',bio:'Living my best life',img:12,isMe:true});
    });
}

// ======================== PROFILE VIEW PAGE ========================
function showProfileView(person){
    $$('.page').forEach(function(p){p.classList.remove('active');});
    document.getElementById('page-profile-view').classList.add('active');
    $$('.nav-link').forEach(function(l){l.classList.remove('active');});
    window.scrollTo(0,0);

    var isMe=person.isMe||false;
    var isFollowed=state.followedUsers[person.id];
    var following=isMe?state.following:(personFollowing[person.id]||[]).length;
    var followers=isMe?state.followers:(personFollowers[person.id]||[]).length;

    // Apply viewed person's skin/font/template (silent, don't change state)
    _pvSaved={skin:state.activeSkin,font:state.activeFont,tpl:state.activeTemplate};
    if(!isMe){
        applySkin(person.skin||null,true);
        applyFont(person.font||null,true);
        applyTemplate(person.template||null,true);
    }

    // Cover banner
    $('#pvCoverBanner').style.backgroundImage='';

    // Profile card - matches home sidebar style
    var cardHtml='<div class="profile-cover" style="background:linear-gradient(135deg,var(--primary),var(--primary-hover));"></div>';
    cardHtml+='<div class="profile-info">';
    cardHtml+='<div class="profile-avatar-wrap"><img src="https://i.pravatar.cc/100?img='+person.img+'" alt="'+person.name+'" class="profile-avatar"></div>';
    cardHtml+='<h3 class="profile-name">'+person.name+'</h3>';
    cardHtml+='<p class="profile-title">'+person.bio+'</p>';
    var pvPriv=isMe?state.privateFollowers:!!person.priv;
    cardHtml+='<div class="profile-stats">';
    cardHtml+='<div class="stat stat-clickable pv-stat-following" style="'+(pvPriv?'opacity:.5;pointer-events:none;cursor:default;':'')+'"><span class="stat-count">'+following+'</span><span class="stat-label">Following'+(pvPriv?' <i class="fas fa-lock" style="font-size:10px;"></i>':'')+'</span></div>';
    cardHtml+='<div class="stat stat-clickable pv-stat-followers" style="'+(pvPriv?'opacity:.5;pointer-events:none;cursor:default;':'')+'"><span class="stat-count">'+followers+'</span><span class="stat-label">Followers'+(pvPriv?' <i class="fas fa-lock" style="font-size:10px;"></i>':'')+'</span></div>';
    cardHtml+='</div>';
    if(!isMe){
        cardHtml+='<div class="pv-actions"><button class="btn '+(isFollowed?'btn-disabled':'btn-green')+'" id="pvFollowBtn" data-uid="'+person.id+'">'+(isFollowed?'<i class="fas fa-check"></i> Following':'<i class="fas fa-plus"></i> Follow')+'</button>';
        cardHtml+='<button class="btn btn-primary" id="pvMsgBtn"><i class="fas fa-envelope"></i> Message</button>';
        cardHtml+='<button class="btn btn-outline" id="pvBlockBtn" style="color:#e74c3c;border-color:#e74c3c;">'+(blockedUsers[person.id]?'<i class="fas fa-unlock"></i> Unblock':'<i class="fas fa-ban"></i> Block')+'</button></div>';
    }
    cardHtml+='<div class="profile-links"><a href="#" class="pv-back-link" id="pvBack"><i class="fas fa-arrow-left"></i> Back to Home</a></div>';
    cardHtml+='</div>';
    $('#pvProfileCard').innerHTML=cardHtml;

    // Photos card - spans full width, always has photos
    var photosHtml='<div class="card photos-card"><h4 class="card-heading"><i class="fas fa-images" style="margin-right:8px;color:var(--primary);"></i>Photos</h4>';
    photosHtml+='<div class="photos-preview">';
    if(isMe){
        var allPhotos=getAllPhotos();
        if(allPhotos.length){allPhotos.slice(0,9).forEach(function(p){photosHtml+='<img src="'+p.src+'">';});}
        else{for(var pi=0;pi<8;pi++){photosHtml+='<img src="https://picsum.photos/seed/me-'+pi+'/200">';}}
    } else {
        var photoCount=6+((person.id*3)%6);
        for(var pi=0;pi<photoCount;pi++){photosHtml+='<img src="https://picsum.photos/seed/'+person.id+'-'+pi+'/200">';}
    }
    photosHtml+='</div>';
    if(isMe) photosHtml+='<a href="#" class="view-more-link pv-photos-link">View All</a>';
    photosHtml+='</div>';
    document.getElementById('pvPhotosCard').innerHTML=photosHtml;
    var pvPP=document.querySelector('#pvPhotosCard .photos-preview');
    if(pvPP&&document.body.classList.contains('tpl-cinema')){pvPP.classList.add('shop-scroll-row');initDragScroll('#pvPhotosCard');}
    var pvPhotosLink=document.querySelector('.pv-photos-link');
    if(pvPhotosLink)pvPhotosLink.addEventListener('click',function(e){e.preventDefault();renderPhotoAlbum();navigateTo('photos');});

    // "What Skin Am I?" box - top row beside profile card and photos
    var pvSkinName=person.skin?skins.find(function(s){return s.id===person.skin;}):null;
    var pvFontName=person.font?fonts.find(function(f){return f.id===person.font;}):null;
    var pvTplName=person.template?templates.find(function(t){return t.id===person.template;}):null;
    var skinHtml='<div class="card" style="padding:20px;"><h4 style="font-size:15px;font-weight:600;margin-bottom:14px;"><i class="fas fa-wand-magic-sparkles" style="color:var(--primary);margin-right:8px;"></i>What Skin Am I?</h4>';
    skinHtml+='<div style="display:flex;flex-direction:column;gap:10px;">';
    skinHtml+='<div style="display:flex;align-items:center;gap:10px;font-size:13px;"><i class="fas fa-palette" style="width:16px;color:var(--primary);"></i><span style="color:var(--gray);">Skin:</span><strong>'+(pvSkinName?pvSkinName.name:'Default')+'</strong></div>';
    skinHtml+='<div style="display:flex;align-items:center;gap:10px;font-size:13px;"><i class="fas fa-font" style="width:16px;color:var(--primary);"></i><span style="color:var(--gray);">Font:</span><strong>'+(pvFontName?pvFontName.name:'Default')+'</strong></div>';
    skinHtml+='<div style="display:flex;align-items:center;gap:10px;font-size:13px;"><i class="fas fa-table-columns" style="width:16px;color:var(--primary);"></i><span style="color:var(--gray);">Template:</span><strong>'+(pvTplName?pvTplName.name:'Default')+'</strong></div>';
    skinHtml+='</div></div>';
    document.getElementById('pvSkinCard').innerHTML=skinHtml;

    // Posts feed (same card style as home center-feed posts)
    var feedHtml='';
    var personPosts=[];
    for(var i=0;i<postTexts.length;i++){
        if(isMe||people[i%people.length].id===person.id){
            personPosts.push(i);
        }
        if(personPosts.length>=5) break;
    }
    if(personPosts.length===0){
        feedHtml+='<div class="card" style="padding:40px;text-align:center;color:var(--gray);"><i class="fas fa-pen" style="font-size:32px;margin-bottom:12px;display:block;"></i><p>No posts yet.</p></div>';
    }
    personPosts.forEach(function(i){
        var text=postTexts[i%postTexts.length];
        var tags=tagSets[i%tagSets.length];
        var badge=badgeTypes[i%badgeTypes.length];
        var loc=locations[i%locations.length];
        var likes=Math.floor(Math.random()*people.length);
        var pvGenComments=getComments('pv-'+i);
        var shares=Math.floor(Math.random()*10);

        feedHtml+='<div class="card feed-post">';
        feedHtml+='<div class="post-header">';
        feedHtml+='<img src="https://i.pravatar.cc/50?img='+person.img+'" alt="'+person.name+'" class="post-avatar">';
        feedHtml+='<div class="post-user-info"><div class="post-user-top"><h4 class="post-username">'+person.name+'</h4><span class="post-time">'+timeAgo(i)+'</span></div>';
        feedHtml+='<div class="post-badges"><span class="badge '+badge.cls+'"><i class="fas '+badge.icon+'"></i> '+badge.text+'</span><span class="badge badge-blue"><i class="fas fa-map-marker-alt"></i> '+loc+'</span></div></div></div>';
        feedHtml+='<div class="post-description"><p>'+text+'</p></div>';
        feedHtml+='<div class="post-tags">';
        tags.forEach(function(t){feedHtml+='<span class="skill-tag">'+t+'</span>';});
        feedHtml+='</div>';
        var pvLikers=getLikers('pv-'+i,likes);
        feedHtml+='<div class="post-actions"><div class="action-left">';
        feedHtml+='<button class="action-btn like-btn" data-post-id="pv-'+i+'"><i class="'+(state.likedPosts['pv-'+i]?'fas':'far')+' fa-thumbs-up"></i><span class="like-count">'+likes+'</span></button>';
        feedHtml+='<button class="action-btn dislike-btn" data-post-id="pv-'+i+'"><i class="'+(state.dislikedPosts['pv-'+i]?'fas':'far')+' fa-thumbs-down"></i><span class="dislike-count">0</span></button>';
        feedHtml+='<button class="action-btn comment-btn"><i class="far fa-comment"></i><span>'+pvGenComments.length+'</span></button>';
        feedHtml+='<button class="action-btn share-btn"><i class="fas fa-share-from-square"></i><span>'+shares+'</span></button>';
        feedHtml+='</div><div class="action-right"><div class="liked-avatars" data-post-id="pv-'+i+'">';
        for(var a=0;a<Math.min(3,pvLikers.length);a++){feedHtml+='<img src="https://i.pravatar.cc/24?img='+pvLikers[a].img+'" alt="'+pvLikers[a].name+'">';}
        feedHtml+='</div></div></div>';
        feedHtml+='<div class="post-comments" data-post-id="pv-'+i+'"></div>';
        feedHtml+='</div>';
    });
    $('#pvPostsFeed').innerHTML=feedHtml;
    personPosts.forEach(function(i){renderInlineComments('pv-'+i);});

    // Event: Back
    document.getElementById('pvBack').addEventListener('click',function(e){e.preventDefault();navigateTo('home');});
    // Event: Follow
    var followBtn=document.getElementById('pvFollowBtn');
    if(followBtn){
        followBtn.addEventListener('click',function(){toggleFollow(person.id,this);});
    }
    // Event: View following/followers lists
    var pvFollowingStat=document.querySelector('.pv-stat-following');
    var pvFollowersStat=document.querySelector('.pv-stat-followers');
    if(pvFollowingStat){
        pvFollowingStat.addEventListener('click',function(){
            if(isMe){var list=people.filter(function(p){return state.followedUsers[p.id];});showFollowListModal('Following',list,true);}
            else{var flist=(personFollowing[person.id]||[]).map(function(id){return people.find(function(p){return p.id===id;});});showFollowListModal(person.name+'\'s Following',flist,false);}
        });
    }
    if(pvFollowersStat){
        pvFollowersStat.addEventListener('click',function(){
            if(isMe){var list=myFollowers.map(function(id){return people.find(function(p){return p.id===id;});});showFollowListModal('Followers',list,false);}
            else{var flist=(personFollowers[person.id]||[]).map(function(id){return people.find(function(p){return p.id===id;});});showFollowListModal(person.name+'\'s Followers',flist,false);}
        });
    }
    // Event: Message
    var msgBtn=document.getElementById('pvMsgBtn');
    if(msgBtn){
        msgBtn.addEventListener('click',function(){
            navigateTo('messages');
            var existing=msgContacts.find(function(c){return c.name===person.name;});
            if(!existing){
                existing={id:msgContacts.length+1,name:person.name,img:person.img,messages:[{from:'me',text:'Hey '+person.name+'!'}]};
                msgContacts.push(existing);
                renderMsgContacts();
            }
            openChat(existing);
        });
    }
    var blockBtn=document.getElementById('pvBlockBtn');
    if(blockBtn){
        blockBtn.addEventListener('click',function(){
            if(blockedUsers[person.id]){
                unblockUser(person.id);
                showProfileView(person);
            } else {
                showBlockConfirmModal(person,function(){showProfileView(person);});
            }
        });
    }
    // Event: Likes
    $$('#pvPostsFeed .like-btn').forEach(function(btn){
        btn.addEventListener('click',function(e){
            if(e.target.classList.contains('like-count')) return;
            var pid=btn.getAttribute('data-post-id');var countEl=btn.querySelector('.like-count');var count=parseInt(countEl.textContent);
            var had=!!(state.likedPosts[pid]||state.dislikedPosts[pid]);
            if(state.likedPosts[pid]){delete state.likedPosts[pid];btn.classList.remove('liked');btn.querySelector('i').className='far fa-thumbs-up';countEl.textContent=count-1;}
            else{if(state.dislikedPosts[pid]){var db=btn.closest('.action-left').querySelector('.dislike-btn');var dc=db.querySelector('.dislike-count');dc.textContent=parseInt(dc.textContent)-1;delete state.dislikedPosts[pid];db.classList.remove('disliked');db.querySelector('i').className='far fa-thumbs-down';}state.likedPosts[pid]=true;btn.classList.add('liked');btn.querySelector('i').className='fas fa-thumbs-up';countEl.textContent=count+1;}
            var has=!!(state.likedPosts[pid]||state.dislikedPosts[pid]);if(!had&&has){state.coins++;updateCoins();}else if(had&&!has){state.coins--;updateCoins();}
        });
    });
    $$('#pvPostsFeed .dislike-btn').forEach(function(btn){
        btn.addEventListener('click',function(){
            var pid=btn.getAttribute('data-post-id');var countEl=btn.querySelector('.dislike-count');var count=parseInt(countEl.textContent);
            var had=!!(state.likedPosts[pid]||state.dislikedPosts[pid]);
            if(state.dislikedPosts[pid]){delete state.dislikedPosts[pid];btn.classList.remove('disliked');btn.querySelector('i').className='far fa-thumbs-down';countEl.textContent=count-1;}
            else{if(state.likedPosts[pid]){var lb=btn.closest('.action-left').querySelector('.like-btn');var lc=lb.querySelector('.like-count');lc.textContent=parseInt(lc.textContent)-1;delete state.likedPosts[pid];lb.classList.remove('liked');lb.querySelector('i').className='far fa-thumbs-up';}state.dislikedPosts[pid]=true;btn.classList.add('disliked');btn.querySelector('i').className='fas fa-thumbs-down';countEl.textContent=count+1;}
            var has=!!(state.likedPosts[pid]||state.dislikedPosts[pid]);if(!had&&has){state.coins++;updateCoins();}else if(had&&!has){state.coins--;updateCoins();}
        });
    });
    // Event: Comments
    $$('#pvPostsFeed .comment-btn').forEach(function(btn){
        btn.addEventListener('click',function(){
            var postId=btn.closest('.action-left').querySelector('.like-btn').getAttribute('data-post-id');
            showComments(postId,btn.querySelector('span'));
        });
    });
    // Event: Share
    $$('#pvPostsFeed .share-btn').forEach(function(btn){btn.addEventListener('click',function(){handleShare(btn);});});
    bindLikeCountClicks('#pvPostsFeed');
}

function showGroupModal(group){
    var joined=state.joinedGroups[group.id];
    var html='<div class="modal-header"><h3>'+group.name+'</h3><button class="modal-close"><i class="fas fa-times"></i></button></div>';
    html+='<div class="modal-body"><div style="text-align:center;margin-bottom:20px;"><div style="width:64px;height:64px;border-radius:16px;background:'+group.color+';color:#fff;font-size:28px;display:flex;align-items:center;justify-content:center;margin:0 auto 12px;"><i class="fas '+group.icon+'"></i></div>';
    html+='<h3 style="font-size:18px;font-weight:600;margin-bottom:4px;">'+group.name+'</h3><p style="color:#777;font-size:14px;margin-bottom:8px;">'+group.desc+'</p>';
    html+='<span class="group-members"><i class="fas fa-users"></i> '+fmtNum(group.members)+' members</span></div>';
    html+='<div class="modal-actions"><button class="btn '+(joined?'btn-disabled':'btn-primary')+'" id="modalJoinBtn" data-gid="'+group.id+'">'+(joined?'Joined':'Join Group')+'</button></div></div>';
    showModal(html);
    document.getElementById('modalJoinBtn').addEventListener('click',function(){
        if(!state.joinedGroups[group.id]){
            state.joinedGroups[group.id]=true;
            group.members++;
            this.textContent='Joined';
            this.classList.remove('btn-primary');
            this.classList.add('btn-disabled');
            addNotification('group','You joined the group "'+group.name+'"');
        }
    });
}

function showGroupProfileModal(person,group){
    var isFollowed=state.followedUsers[person.id];
    var myRole=getMyGroupRole(group);
    var myRank=roleRank(myRole);
    var theirRole=getPersonGroupRole(person,group);
    var theirRank=roleRank(theirRole);
    var html='<div class="modal-header"><h3>Profile</h3><button class="modal-close"><i class="fas fa-times"></i></button></div>';
    html+='<div class="modal-body" style="padding:16px;">';
    html+='<div style="display:flex;align-items:center;gap:14px;margin-bottom:12px;">';
    html+='<img src="https://i.pravatar.cc/80?img='+person.img+'" alt="'+person.name+'" style="width:56px;height:56px;border-radius:50%;object-fit:cover;flex-shrink:0;">';
    html+='<div><h3 style="font-size:16px;font-weight:600;margin:0;">'+person.name+'</h3><p style="font-size:13px;color:var(--gray);margin:2px 0 0;">'+person.bio+'</p>';
    if(theirRole!=='Member') html+='<span style="font-size:10px;background:'+(theirRole==='Co-Admin'?'#8b5cf6':theirRole==='Moderator'?'var(--primary)':'#e74c3c')+';color:#fff;padding:1px 7px;border-radius:8px;display:inline-block;margin-top:3px;">'+theirRole+'</span>';
    html+='</div></div>';
    html+='<div style="display:flex;justify-content:center;gap:24px;padding:10px 0;border-top:1px solid var(--border);border-bottom:1px solid var(--border);margin-bottom:12px;"><div class="stat"><span class="stat-count" style="font-size:15px;">'+Math.floor(Math.random()*500)+'</span><span class="stat-label" style="font-size:11px;">Following</span></div><div class="stat"><span class="stat-count" style="font-size:15px;">'+Math.floor(Math.random()*2000)+'</span><span class="stat-label" style="font-size:11px;">Followers</span></div></div>';
    html+='<div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center;">';
    html+='<button class="btn '+(isFollowed?'btn-disabled':'btn-green')+'" id="modalFollowBtn" data-uid="'+person.id+'" style="font-size:12px;padding:6px 12px;">'+(isFollowed?'<i class="fas fa-check"></i> Following':'<i class="fas fa-plus"></i> Follow')+'</button>';
    html+='<button class="btn btn-primary" id="modalMsgBtn" data-uid="'+person.id+'" style="font-size:12px;padding:6px 12px;"><i class="fas fa-envelope"></i> Message</button>';
    html+='<button class="btn btn-outline" id="modalViewProfileBtn" style="font-size:12px;padding:6px 12px;"><i class="fas fa-user"></i> View Profile</button>';
    // Role management buttons
    if(myRole==='Admin'){
        if(theirRole==='Member'){
            html+='<button class="btn btn-outline" id="grpSetMod" style="font-size:12px;padding:6px 12px;"><i class="fas fa-shield-halved"></i> Make Mod</button>';
            html+='<button class="btn btn-outline" id="grpSetCoAdmin" style="font-size:12px;padding:6px 12px;color:#8b5cf6;border-color:#8b5cf6;"><i class="fas fa-shield"></i> Co-Admin</button>';
        } else if(theirRole==='Moderator'){
            html+='<button class="btn btn-outline" id="grpSetCoAdmin" style="font-size:12px;padding:6px 12px;color:#8b5cf6;border-color:#8b5cf6;"><i class="fas fa-shield"></i> Promote</button>';
            html+='<button class="btn btn-outline" id="grpRemoveRole" style="font-size:12px;padding:6px 12px;color:#e74c3c;border-color:#e74c3c;"><i class="fas fa-shield-halved"></i> Remove Mod</button>';
        } else if(theirRole==='Co-Admin'){
            html+='<button class="btn btn-outline" id="grpRemoveRole" style="font-size:12px;padding:6px 12px;color:#e74c3c;border-color:#e74c3c;"><i class="fas fa-shield"></i> Demote</button>';
        }
        if(theirRole==='Co-Admin'||theirRole==='Moderator'){
            html+='<button class="btn btn-outline" id="grpTransferOwn" style="font-size:12px;padding:6px 12px;color:#f59e0b;border-color:#f59e0b;"><i class="fas fa-crown"></i> Transfer</button>';
        }
    } else if(myRole==='Co-Admin'){
        if(theirRole==='Member') html+='<button class="btn btn-outline" id="grpSetMod" style="font-size:12px;padding:6px 12px;"><i class="fas fa-shield-halved"></i> Make Mod</button>';
        if(theirRole==='Moderator') html+='<button class="btn btn-outline" id="grpRemoveRole" style="font-size:12px;padding:6px 12px;color:#e74c3c;border-color:#e74c3c;"><i class="fas fa-shield-halved"></i> Remove Mod</button>';
    }
    html+='</div></div>';
    showModal(html);
    document.getElementById('modalFollowBtn').addEventListener('click',function(){toggleFollow(person.id,this);});
    document.getElementById('modalMsgBtn').addEventListener('click',function(){
        closeModal();navigateTo('messages');
        var existing=msgContacts.find(function(c){return c.name===person.name;});
        if(!existing){existing={id:msgContacts.length+1,name:person.name,img:person.img,messages:[{from:'me',text:'Hey '+person.name+'!'}]};msgContacts.push(existing);renderMsgContacts();}
        openChat(existing);
    });
    document.getElementById('modalViewProfileBtn').addEventListener('click',function(){closeModal();showProfileView(person);});
    var setModBtn=document.getElementById('grpSetMod');
    if(setModBtn){setModBtn.addEventListener('click',function(){
        group.mods.push({name:person.name,img:person.img,role:'Moderator'});
        addNotification('group','You made '+person.name+' a Moderator of "'+group.name+'"');
        closeModal();showGroupView(group);
    });}
    var setCoAdminBtn=document.getElementById('grpSetCoAdmin');
    if(setCoAdminBtn){setCoAdminBtn.addEventListener('click',function(){
        group.mods=group.mods.filter(function(m){return m.name!==person.name;});
        group.mods.unshift({name:person.name,img:person.img,role:'Co-Admin'});
        addNotification('group','You made '+person.name+' a Co-Admin of "'+group.name+'"');
        closeModal();showGroupView(group);
    });}
    var removeRoleBtn=document.getElementById('grpRemoveRole');
    if(removeRoleBtn){removeRoleBtn.addEventListener('click',function(){
        group.mods=group.mods.filter(function(m){return m.name!==person.name;});
        addNotification('group','You removed '+person.name+'\'s role in "'+group.name+'"');
        closeModal();showGroupView(group);
    });}
    var transferBtn=document.getElementById('grpTransferOwn');
    if(transferBtn){transferBtn.addEventListener('click',function(){
        showTransferOwnershipModal(person,group);
    });}
}

function showTransferOwnershipModal(person,group){
    var h='<div class="modal-header"><h3>Transfer Ownership</h3><button class="modal-close"><i class="fas fa-times"></i></button></div><div class="modal-body">';
    h+='<p style="text-align:center;margin-bottom:4px;">Transfer ownership of <strong>'+group.name+'</strong> to <strong>'+person.name+'</strong>?</p>';
    h+='<p style="text-align:center;color:#e74c3c;font-size:13px;margin-bottom:16px;">You will be demoted to Co-Admin.</p>';
    h+='<label style="font-size:13px;font-weight:600;display:block;margin-bottom:6px;">Type the exact group name to confirm:</label>';
    h+='<input type="text" class="post-input" id="transferConfirmInput" placeholder="'+group.name+'" style="width:100%;margin-bottom:16px;">';
    h+='<div class="modal-actions"><button class="btn btn-outline" id="transferCancel">Cancel</button><button class="btn btn-primary" id="transferConfirm" disabled style="background:#f59e0b;border-color:#f59e0b;opacity:.5;"><i class="fas fa-crown"></i> Transfer</button></div></div>';
    showModal(h);
    var inp=document.getElementById('transferConfirmInput'),btn=document.getElementById('transferConfirm');
    inp.addEventListener('input',function(){var match=inp.value===group.name;btn.disabled=!match;btn.style.opacity=match?'1':'.5';});
    document.getElementById('transferCancel').addEventListener('click',closeModal);
    btn.addEventListener('click',function(){
        if(inp.value!==group.name)return;
        // Remove person from mods, make them admin
        group.mods=group.mods.filter(function(m){return m.name!==person.name;});
        // Add me as Co-Admin
        group.mods.unshift({name:'John Doe',img:12,role:'Co-Admin'});
        // Transfer ownership
        group.createdBy=person.name;
        group.adminName=person.name;group.adminImg=person.img;
        addNotification('group','You transferred ownership of "'+group.name+'" to '+person.name);
        closeModal();showGroupView(group);
    });
}

function showDeleteGroupModal(group){
    var h='<div class="modal-header"><h3>Delete Group</h3><button class="modal-close"><i class="fas fa-times"></i></button></div><div class="modal-body">';
    h+='<p style="text-align:center;color:#e74c3c;font-weight:600;margin-bottom:8px;"><i class="fas fa-triangle-exclamation"></i> This action cannot be undone.</p>';
    h+='<p style="text-align:center;margin-bottom:16px;">All posts, members, and data will be permanently deleted.</p>';
    h+='<label style="font-size:13px;font-weight:600;display:block;margin-bottom:6px;">Type the exact group name to confirm:</label>';
    h+='<input type="text" class="post-input" id="deleteConfirmInput" placeholder="'+group.name+'" style="width:100%;margin-bottom:16px;">';
    h+='<div class="modal-actions"><button class="btn btn-outline" id="deleteCancel">Cancel</button><button class="btn btn-primary" id="deleteConfirm" disabled style="background:#e74c3c;border-color:#e74c3c;opacity:.5;">Delete Group</button></div></div>';
    showModal(h);
    var inp=document.getElementById('deleteConfirmInput'),btn=document.getElementById('deleteConfirm');
    inp.addEventListener('input',function(){var match=inp.value===group.name;btn.disabled=!match;btn.style.opacity=match?'1':'.5';});
    document.getElementById('deleteCancel').addEventListener('click',closeModal);
    btn.addEventListener('click',function(){
        if(inp.value!==group.name)return;
        var idx=groups.indexOf(group);
        if(idx!==-1)groups.splice(idx,1);
        delete state.joinedGroups[group.id];
        if(state.groupPosts)delete state.groupPosts[group.id];
        addNotification('group','You deleted the group "'+group.name+'"');
        closeModal();renderGroups();navigateTo('groups');
    });
}

function showSelfRoleRemovalModal(group,callback){
    var h='<div class="modal-header"><h3>Remove Your Role</h3><button class="modal-close"><i class="fas fa-times"></i></button></div><div class="modal-body">';
    h+='<p style="text-align:center;margin-bottom:8px;">You will be downgraded to <strong>Member</strong>.</p>';
    h+='<label style="font-size:13px;font-weight:600;display:block;margin-bottom:6px;">Type your first name to confirm:</label>';
    h+='<input type="text" class="post-input" id="selfRemoveInput" placeholder="John" style="width:100%;margin-bottom:16px;">';
    h+='<div class="modal-actions"><button class="btn btn-outline" id="selfRemoveCancel">Cancel</button><button class="btn btn-primary" id="selfRemoveConfirm" disabled style="background:#e74c3c;border-color:#e74c3c;opacity:.5;">Confirm</button></div></div>';
    showModal(h);
    var inp=document.getElementById('selfRemoveInput'),btn=document.getElementById('selfRemoveConfirm');
    inp.addEventListener('input',function(){var match=inp.value==='John';btn.disabled=!match;btn.style.opacity=match?'1':'.5';});
    document.getElementById('selfRemoveCancel').addEventListener('click',closeModal);
    btn.addEventListener('click',function(){if(inp.value!=='John')return;callback();});
}

function showGroupMembersModal(group){
    var memberList=group.memberIds?people.filter(function(p){return group.memberIds.indexOf(p.id)!==-1;}):people;
    var myRole=getMyGroupRole(group);
    var myRank=roleRank(myRole);
    var canManage=myRank>=2; // Mod+
    var html='<div class="modal-header"><h3>'+group.name+' — Members</h3><button class="modal-close"><i class="fas fa-times"></i></button></div><div class="modal-body">';
    html+='<div class="follow-list">';
    memberList.forEach(function(p){
        var followed=state.followedUsers[p.id];
        var pRole=getPersonGroupRole(p,group);
        var pRank=roleRank(pRole);
        var roleColors={'Co-Admin':'#8b5cf6','Moderator':'var(--primary)','Admin':'#e74c3c'};
        var roleTag=pRole!=='Member'?' <span style="font-size:10px;background:'+(roleColors[pRole]||'var(--primary)')+';color:#fff;padding:2px 6px;border-radius:8px;margin-left:4px;">'+pRole+'</span>':'';
        html+='<div class="follow-list-item" style="flex-wrap:wrap;"><img src="https://i.pravatar.cc/44?img='+p.img+'" alt="'+p.name+'" class="gvm-click" data-person-id="'+p.id+'" style="cursor:pointer;"><div class="follow-list-info" style="flex:1;"><h4>'+p.name+roleTag+'</h4><p>'+p.bio+'</p></div>';
        html+='<div style="display:flex;gap:6px;">';
        html+='<button class="btn follow-btn-small '+(followed?'btn-disabled':'btn-green')+' gvm-follow-btn" data-uid="'+p.id+'">'+(followed?'<i class="fas fa-check"></i>':'<i class="fas fa-plus"></i>')+'</button>';
        if(canManage&&myRank>pRank&&p.name!=='John Doe') html+='<button class="btn follow-btn-small gvm-remove-btn" data-uid="'+p.id+'" style="background:#e74c3c;color:#fff;border-color:#e74c3c;" title="Remove Member"><i class="fas fa-user-minus"></i></button>';
        html+='</div></div>';
    });
    html+='</div></div>';
    showModal(html);
    $$('.gvm-follow-btn').forEach(function(btn){btn.addEventListener('click',function(){toggleFollow(+btn.dataset.uid,btn);});});
    $$('.gvm-click').forEach(function(img){img.addEventListener('click',function(){var p=people.find(function(x){return x.id===parseInt(img.dataset.personId);});if(p){closeModal();showGroupProfileModal(p,group);}});});
    $$('.gvm-remove-btn').forEach(function(btn){btn.addEventListener('click',function(){
        var uid=parseInt(btn.dataset.uid);var p=people.find(function(x){return x.id===uid;});if(!p)return;
        var ch='<div class="modal-header"><h3>Remove Member</h3><button class="modal-close"><i class="fas fa-times"></i></button></div><div class="modal-body">';
        ch+='<p style="text-align:center;margin-bottom:16px;">Remove <strong>'+p.name+'</strong> from <strong>'+group.name+'</strong>?</p>';
        ch+='<div class="modal-actions"><button class="btn btn-outline" id="rmCancel">Cancel</button><button class="btn btn-primary" id="rmConfirm" style="background:#e74c3c;border-color:#e74c3c;">Remove</button></div></div>';
        showModal(ch);
        document.getElementById('rmCancel').addEventListener('click',function(){closeModal();showGroupMembersModal(group);});
        document.getElementById('rmConfirm').addEventListener('click',function(){
            group.mods=group.mods.filter(function(m){return m.name!==p.name;});
            if(group.memberIds){group.memberIds=group.memberIds.filter(function(id){return id!==uid;});}
            group.members=Math.max(0,group.members-1);
            addNotification('group','You removed '+p.name+' from "'+group.name+'"');
            closeModal();showGroupView(group);
        });
    });});
}

// ======================== GROUP VIEW PAGE ========================
function showGroupView(group){
    $$('.page').forEach(function(p){p.classList.remove('active');});
    document.getElementById('page-group-view').classList.add('active');
    $$('.nav-link').forEach(function(l){l.classList.remove('active');});
    window.scrollTo(0,0);

    var joined=state.joinedGroups[group.id];
    var isOwner=group.createdBy==='me';
    var themeColor=state.activeSkin&&skinColors[state.activeSkin]?skinColors[state.activeSkin].primary:group.color;
    var banner=$('#gvCoverBanner');
    banner.style.background=group.coverPhoto?'url('+group.coverPhoto+') center/cover':themeColor;
    var coverBtn=$('#gvCoverEditBtn');
    coverBtn.style.display=isOwner?'flex':'none';

    // Profile card
    var cardHtml='<div class="profile-cover" style="background:'+themeColor+';"></div>';
    cardHtml+='<div class="profile-info">';
    if(group.profileImg){
        cardHtml+='<div class="profile-avatar-wrap"><img src="'+group.profileImg+'" class="profile-avatar" style="object-fit:cover;">';
        if(isOwner) cardHtml+='<button class="avatar-edit-btn" id="gvIconEditBtn" title="Change Photo"><i class="fas fa-camera"></i></button>';
        cardHtml+='<input type="file" id="gvProfileImgInput" accept="image/*" style="display:none;">';
        cardHtml+='</div>';
    } else {
        cardHtml+='<div class="profile-avatar-wrap"><div class="gv-icon-wrap" style="background:'+themeColor+';">';
        cardHtml+='<i class="fas '+group.icon+'" id="gvIconDisplay"></i>';
        if(isOwner) cardHtml+='<button class="avatar-edit-btn" id="gvIconEditBtn" title="Change Icon"><i class="fas fa-camera"></i></button>';
        cardHtml+='<input type="file" id="gvProfileImgInput" accept="image/*" style="display:none;">';
        cardHtml+='</div></div>';
    }
    cardHtml+='<h3 class="profile-name">'+group.name+'</h3>';
    cardHtml+='<p class="profile-title">'+group.desc+'</p>';
    cardHtml+='<div class="profile-stats"><div class="stat"><span class="stat-count">'+fmtNum(group.members)+'</span><span class="stat-label">Members</span></div><div class="stat"><span class="stat-count" id="gvPostCount">0</span><span class="stat-label">Posts</span></div></div>';
    cardHtml+='<div class="pv-actions">';
    if(isOwner) cardHtml+='<button class="btn btn-outline" id="gvEditBtn"><i class="fas fa-pen"></i> Edit Group</button>';
    cardHtml+='<button class="btn '+(joined?'btn-disabled':'btn-primary')+'" id="gvJoinBtn" data-gid="'+group.id+'">'+(joined?'Joined':'Join Group')+'</button>';
    if(joined||isOwner) cardHtml+='<button class="btn btn-outline" id="gvLeaveBtn" style="color:#e74c3c;border-color:#e74c3c;"><i class="fas fa-right-from-bracket"></i> Leave Group</button>';
    cardHtml+='</div>';
    cardHtml+='<a href="#" class="pv-back-link" id="gvBack"><i class="fas fa-arrow-left"></i> Back to Groups</a>';
    cardHtml+='</div>';
    $('#gvProfileCard').innerHTML=cardHtml;

    // Left sidebar - About + Admin/Mods
    var adminName=group.adminName||'John Doe';
    var adminImg=group.adminImg||12;
    var amIAdmin=group.createdBy==='me';
    var leftHtml='<div class="card gv-about-card"><h4 class="card-heading"><i class="fas fa-info-circle" style="color:var(--primary);margin-right:6px;"></i>About</h4>';
    leftHtml+='<div class="gv-about-body"><div class="gv-about-meta"><span><i class="fas fa-calendar"></i> Created recently</span>';
    leftHtml+='<span><i class="fas fa-globe"></i> Public group</span></div></div></div>';
    leftHtml+='<div class="card gv-staff-card"><h4 class="card-heading"><i class="fas fa-shield-halved" style="color:var(--primary);margin-right:6px;"></i>Admin & Mods</h4><div class="gv-staff-list">';
    leftHtml+='<div class="gv-staff-item"><img src="https://i.pravatar.cc/40?img='+adminImg+'"><div><strong>'+adminName+'</strong><span class="gv-staff-role admin">Admin'+(amIAdmin?' (You)':'')+'</span></div></div>';
    group.mods.forEach(function(m){var mp=people.find(function(x){return x.name===m.name;});var isSelf=m.name==='John Doe';var roleClass=m.role==='Co-Admin'?'coadmin':'mod';leftHtml+='<div class="gv-staff-item">'+((joined||isOwner)&&mp?'<img src="https://i.pravatar.cc/40?img='+m.img+'" class="gv-staff-click" data-person-id="'+mp.id+'" style="cursor:pointer;">':'<img src="https://i.pravatar.cc/40?img='+m.img+'">')+'<div><strong>'+m.name+(isSelf?' (You)':'')+'</strong><span class="gv-staff-role '+roleClass+'">'+m.role+'</span></div></div>';});
    leftHtml+='</div></div>';
    if(amIAdmin) leftHtml+='<button class="btn btn-outline btn-block" id="gvDeleteGroupBtn" style="color:#e74c3c;border-color:#e74c3c;margin-top:12px;"><i class="fas fa-trash"></i> Delete Group</button>';
    $('#gvLeftSidebar').innerHTML=leftHtml;

    // Right sidebar - rules + members preview
    if(!group.rules) group.rules=['Be respectful to all members','No spam or self-promotion','Stay on topic','No hate speech'];
    var rightHtml='<div class="card gv-rules-card"><h4 class="card-heading"><i class="fas fa-scroll" style="color:var(--primary);margin-right:6px;"></i>Group Rules';
    if(isOwner) rightHtml+='<button class="gv-edit-rules-btn" id="gvEditRulesBtn" title="Edit Rules"><i class="fas fa-pen"></i></button>';
    rightHtml+='</h4><div class="gv-rules-body"><ol>';
    group.rules.forEach(function(r){rightHtml+='<li>'+r+'</li>';});
    rightHtml+='</ol></div></div>';
    var gvMembers=group.memberIds?people.filter(function(p){return group.memberIds.indexOf(p.id)!==-1;}):people;
    var moreCount=Math.max(0,group.members-6);
    rightHtml+='<div class="card"><h4 class="card-heading"><i class="fas fa-user-friends" style="color:var(--primary);margin-right:6px;"></i>Members</h4><div class="gv-members-preview">';
    gvMembers.slice(0,6).forEach(function(p){rightHtml+='<img src="https://i.pravatar.cc/36?img='+p.img+'" title="'+p.name+'"'+((joined||isOwner)?' class="gv-member-click" data-person-id="'+p.id+'" style="cursor:pointer;"':'')+'>';});
    if(moreCount>0) rightHtml+='<span class="gv-members-more"'+((joined||isOwner)?' id="gvShowAllMembers" style="cursor:pointer;"':'')+'>+'+fmtNum(moreCount)+' more</span>';
    rightHtml+='</div></div>';
    $('#gvRightSidebar').innerHTML=rightHtml;

    // Post bar (only if joined)
    if(joined||isOwner){
        $('#gvPostBar').innerHTML='<div class="card post-create-bar" id="gvOpenPostModal"><img src="'+$('#profileAvatarImg').src+'" alt="User" class="post-create-avatar"><div class="post-input-fake">Post in '+group.name+'...</div></div>';
        document.getElementById('gvOpenPostModal').addEventListener('click',function(){openGroupPostModal(group);});
    } else {
        $('#gvPostBar').innerHTML='';
    }

    // Feed posts
    var feedHtml='<div class="card"><h4 class="pv-posts-heading"><i class="fas fa-stream" style="color:var(--primary);margin-right:8px;"></i>Group Posts</h4></div>';
    var groupPosts=state.groupPosts&&state.groupPosts[group.id]?state.groupPosts[group.id]:[];
    groupPosts.forEach(function(p,i){
        feedHtml+='<div class="card feed-post"><div class="post-header"><img src="'+p.avatar+'" alt="'+p.name+'" class="post-avatar"><div class="post-user-info"><div class="post-user-top"><h4 class="post-username">'+p.name+'</h4><span class="post-time">'+p.time+'</span></div><div class="post-badges"><span class="badge badge-green"><i class="fas fa-user"></i> You</span></div></div></div>';
        feedHtml+='<div class="post-description"><p>'+p.text+'</p>'+(p.media||'')+'</div>';
        feedHtml+='<div class="post-actions"><div class="action-left"><button class="action-btn like-btn" data-post-id="gvp-'+group.id+'-'+i+'"><i class="far fa-thumbs-up"></i><span class="like-count">0</span></button><button class="action-btn dislike-btn" data-post-id="gvp-'+group.id+'-'+i+'"><i class="far fa-thumbs-down"></i><span class="dislike-count">0</span></button><button class="action-btn comment-btn"><i class="far fa-comment"></i><span>0</span></button></div></div></div>';
    });
    for(var i=0;i<8;i++){
        var person=people[i%people.length];
        var text=postTexts[(group.id*5+i)%postTexts.length];
        var tags=tagSets[(group.id*5+i)%tagSets.length];
        var likes=Math.floor(Math.random()*people.length);
        var gvGenComments=getComments('gv-'+group.id+'-'+i);
        feedHtml+='<div class="card feed-post"><div class="post-header"><img src="https://i.pravatar.cc/50?img='+person.img+'" alt="'+person.name+'" class="post-avatar"><div class="post-user-info"><div class="post-user-top"><h4 class="post-username">'+person.name+'</h4><span class="post-time">'+timeAgo(i)+'</span></div><div class="post-badges"><span class="badge badge-blue"><i class="fas fa-users"></i> '+group.name+'</span></div></div></div>';
        feedHtml+='<div class="post-description"><p>'+text+'</p></div>';
        feedHtml+='<div class="post-tags">';tags.forEach(function(t){feedHtml+='<span class="skill-tag">'+t+'</span>';});feedHtml+='</div>';
        var gvLikers=getLikers('gv-'+group.id+'-'+i,likes);
        feedHtml+='<div class="post-actions"><div class="action-left"><button class="action-btn like-btn" data-post-id="gv-'+group.id+'-'+i+'"><i class="far fa-thumbs-up"></i><span class="like-count">'+likes+'</span></button><button class="action-btn dislike-btn" data-post-id="gv-'+group.id+'-'+i+'"><i class="far fa-thumbs-down"></i><span class="dislike-count">0</span></button><button class="action-btn comment-btn"><i class="far fa-comment"></i><span>'+gvGenComments.length+'</span></button></div><div class="action-right"><div class="liked-avatars" data-post-id="gv-'+group.id+'-'+i+'">';
        for(var a=0;a<Math.min(3,gvLikers.length);a++){feedHtml+='<img src="https://i.pravatar.cc/24?img='+gvLikers[a].img+'" alt="'+gvLikers[a].name+'">';}
        feedHtml+='</div></div></div>';
        feedHtml+='<div class="post-comments" data-post-id="gv-'+group.id+'-'+i+'"></div>';
        feedHtml+='</div>';
    }
    $('#gvPostsFeed').innerHTML=feedHtml;
    for(var k=0;k<8;k++) renderInlineComments('gv-'+group.id+'-'+k);
    $('#gvPostCount').textContent=groupPosts.length+8;

    // Event listeners
    document.getElementById('gvBack').addEventListener('click',function(e){e.preventDefault();navigateTo('groups');});
    var joinBtn=document.getElementById('gvJoinBtn');
    if(joinBtn){joinBtn.addEventListener('click',function(){if(!state.joinedGroups[group.id]){state.joinedGroups[group.id]=true;group.members++;this.textContent='Joined';this.classList.remove('btn-primary');this.classList.add('btn-disabled');addNotification('group','You joined "'+group.name+'"');showGroupView(group);}});}
    var leaveBtn=document.getElementById('gvLeaveBtn');
    if(leaveBtn){leaveBtn.addEventListener('click',function(){
        var myRole=getMyGroupRole(group);
        if(myRole==='Admin'){
            var coAdmin=group.mods.find(function(m){return m.role==='Co-Admin';});
            if(coAdmin){
                // Auto-promote Co-Admin and leave
                var h='<div class="modal-header"><h3>Leave Group</h3><button class="modal-close"><i class="fas fa-times"></i></button></div><div class="modal-body">';
                h+='<p style="text-align:center;margin-bottom:6px;">Are you sure you want to leave <strong>'+group.name+'</strong>?</p>';
                h+='<p style="text-align:center;color:var(--gray);font-size:13px;margin-bottom:16px;"><strong>'+coAdmin.name+'</strong> will be promoted to Admin.</p>';
                h+='<div class="modal-actions"><button class="btn btn-outline" id="gvLeaveCancel">Cancel</button><button class="btn btn-primary" id="gvLeaveConfirm" style="background:#e74c3c;border-color:#e74c3c;">Leave</button></div></div>';
                showModal(h);
                document.getElementById('gvLeaveCancel').addEventListener('click',closeModal);
                document.getElementById('gvLeaveConfirm').addEventListener('click',function(){
                    group.mods=group.mods.filter(function(m){return m.name!==coAdmin.name;});
                    group.createdBy=coAdmin.name;group.adminName=coAdmin.name;group.adminImg=coAdmin.img;
                    delete state.joinedGroups[group.id];group.members=Math.max(0,group.members-1);
                    addNotification('group','You left "'+group.name+'". '+coAdmin.name+' is now Admin.');
                    closeModal();renderGroups();navigateTo('groups');
                });
            } else {
                var h='<div class="modal-header"><h3>Cannot Leave</h3><button class="modal-close"><i class="fas fa-times"></i></button></div><div class="modal-body">';
                h+='<p style="text-align:center;color:var(--gray);margin-bottom:16px;">You are the only Admin of this group.</p>';
                h+='<p style="text-align:center;font-weight:600;margin-bottom:16px;">Transfer ownership before leaving.</p>';
                h+='<div class="modal-actions"><button class="btn btn-primary modal-close-btn">OK</button></div></div>';
                showModal(h);$$('.modal-close-btn').forEach(function(b){b.addEventListener('click',closeModal);});
            }
        } else if(myRole==='Co-Admin'||myRole==='Moderator'){
            showSelfRoleRemovalModal(group,function(){
                group.mods=group.mods.filter(function(m){return m.name!=='John Doe';});
                delete state.joinedGroups[group.id];group.members=Math.max(0,group.members-1);
                addNotification('group','You left "'+group.name+'"');
                closeModal();renderGroups();navigateTo('groups');
            });
        } else {
            var h='<div class="modal-header"><h3>Leave Group</h3><button class="modal-close"><i class="fas fa-times"></i></button></div><div class="modal-body">';
            h+='<p style="text-align:center;margin-bottom:16px;">Are you sure you want to leave <strong>'+group.name+'</strong>?</p>';
            h+='<div class="modal-actions"><button class="btn btn-outline" id="gvLeaveCancel">Cancel</button><button class="btn btn-primary" id="gvLeaveConfirm" style="background:#e74c3c;border-color:#e74c3c;">Leave</button></div></div>';
            showModal(h);
            document.getElementById('gvLeaveCancel').addEventListener('click',closeModal);
            document.getElementById('gvLeaveConfirm').addEventListener('click',function(){
                delete state.joinedGroups[group.id];group.members=Math.max(0,group.members-1);
                addNotification('group','You left "'+group.name+'"');
                closeModal();renderGroups();navigateTo('groups');
            });
        }
    });}
    var editBtn=document.getElementById('gvEditBtn');
    if(editBtn){editBtn.addEventListener('click',function(){
        var html='<div class="modal-header"><h3>Edit Group</h3><button class="modal-close"><i class="fas fa-times"></i></button></div><div class="modal-body">';
        html+='<div style="margin-bottom:14px;"><label style="font-size:13px;font-weight:600;display:block;margin-bottom:6px;">Group Name</label><input type="text" class="post-input" id="editGrpName" value="'+group.name+'" style="width:100%;"></div>';
        html+='<div style="margin-bottom:14px;"><label style="font-size:13px;font-weight:600;display:block;margin-bottom:6px;">Description</label><input type="text" class="post-input" id="editGrpDesc" value="'+group.desc+'" style="width:100%;"></div>';
        html+='<button class="btn btn-primary btn-block" id="saveGrpBtn">Save Changes</button></div>';
        showModal(html);
        document.getElementById('saveGrpBtn').addEventListener('click',function(){
            group.name=document.getElementById('editGrpName').value.trim()||group.name;
            group.desc=document.getElementById('editGrpDesc').value.trim()||group.desc;
            closeModal();showGroupView(group);renderGroups();
        });
    });}
    // Cover photo edit for owned groups
    if(isOwner){
        $('#gvCoverEditBtn').addEventListener('click',function(e){e.stopPropagation();$('#gvCoverFileInput').click();});
        $('#gvCoverFileInput').addEventListener('change',function(){var f=this.files[0];if(!f)return;var r=new FileReader();r.onload=function(e){group.coverPhoto=e.target.result;banner.style.background='url('+e.target.result+') center/cover';};r.readAsDataURL(f);});
        var iconBtn=document.getElementById('gvIconEditBtn');
        if(iconBtn){iconBtn.addEventListener('click',function(){
            var icons=['fa-users','fa-camera-retro','fa-gamepad','fa-utensils','fa-dumbbell','fa-music','fa-paw','fa-plane-departure','fa-book','fa-leaf','fa-film','fa-hammer','fa-mug-hot','fa-code','fa-palette','fa-rocket','fa-heart','fa-star'];
            var h='<div class="modal-header"><h3>Group Image</h3><button class="modal-close"><i class="fas fa-times"></i></button></div><div class="modal-body">';
            h+='<button class="btn btn-primary btn-block" id="gvUploadPhotoBtn" style="margin-bottom:16px;"><i class="fas fa-upload"></i> Upload Photo</button>';
            h+='<input type="file" id="gvModalImgInput" accept="image/*" style="display:none;">';
            h+='<p style="text-align:center;color:var(--gray);font-size:13px;margin-bottom:12px;">Or pick an icon:</p>';
            h+='<div class="gv-icon-grid">';
            icons.forEach(function(ic){h+='<button class="gv-icon-pick'+(group.icon===ic&&!group.profileImg?' active':'')+'" data-icon="'+ic+'"><i class="fas '+ic+'"></i></button>';});
            h+='</div></div>';showModal(h);
            document.getElementById('gvUploadPhotoBtn').addEventListener('click',function(){document.getElementById('gvModalImgInput').click();});
            document.getElementById('gvModalImgInput').addEventListener('change',function(){var f=this.files[0];if(!f)return;var r=new FileReader();r.onload=function(e){group.profileImg=e.target.result;closeModal();showGroupView(group);renderGroups();};r.readAsDataURL(f);});
            $$('.gv-icon-pick').forEach(function(btn){btn.addEventListener('click',function(){group.icon=btn.dataset.icon;delete group.profileImg;closeModal();showGroupView(group);renderGroups();});});
        });}
    }
    var rulesBtn=document.getElementById('gvEditRulesBtn');
    if(rulesBtn){rulesBtn.addEventListener('click',function(){
        var h='<div class="modal-header"><h3>Edit Rules</h3><button class="modal-close"><i class="fas fa-times"></i></button></div><div class="modal-body">';
        group.rules.forEach(function(r,i){h+='<div style="margin-bottom:8px;display:flex;gap:8px;align-items:center;"><span style="font-weight:600;color:var(--gray);">'+(i+1)+'.</span><input type="text" class="post-input gv-rule-input" value="'+r+'" style="flex:1;"><button class="gv-rule-del" data-idx="'+i+'" style="background:none;color:var(--gray);font-size:14px;padding:4px;"><i class="fas fa-trash"></i></button></div>';});
        h+='<button class="btn btn-outline" id="gvAddRule" style="margin:8px 0 16px;font-size:13px;"><i class="fas fa-plus"></i> Add Rule</button>';
        h+='<button class="btn btn-primary btn-block" id="gvSaveRules">Save Rules</button></div>';
        showModal(h);
        document.getElementById('gvAddRule').addEventListener('click',function(){
            var container=this.parentElement;
            var inputs=container.querySelectorAll('.gv-rule-input');
            var idx=inputs.length;
            var div=document.createElement('div');div.style.cssText='margin-bottom:8px;display:flex;gap:8px;align-items:center;';
            div.innerHTML='<span style="font-weight:600;color:var(--gray);">'+(idx+1)+'.</span><input type="text" class="post-input gv-rule-input" placeholder="New rule..." style="flex:1;"><button class="gv-rule-del" data-idx="'+idx+'" style="background:none;color:var(--gray);font-size:14px;padding:4px;"><i class="fas fa-trash"></i></button>';
            container.insertBefore(div,this);
        });
        document.getElementById('gvSaveRules').addEventListener('click',function(){
            var inputs=$$('.gv-rule-input');
            group.rules=[];inputs.forEach(function(inp){var v=inp.value.trim();if(v)group.rules.push(v);});
            closeModal();showGroupView(group);
        });
        $$('.gv-rule-del').forEach(function(btn){btn.addEventListener('click',function(){btn.parentElement.remove();});});
    });}
    $$('.gv-member-click').forEach(function(img){img.addEventListener('click',function(){var p=people.find(function(x){return x.id===parseInt(img.dataset.personId);});if(p)showGroupProfileModal(p,group);});});
    $$('.gv-staff-click').forEach(function(img){img.addEventListener('click',function(){var p=people.find(function(x){return x.id===parseInt(img.dataset.personId);});if(p)showGroupProfileModal(p,group);});});
    var showAllBtn=document.getElementById('gvShowAllMembers');
    if(showAllBtn){showAllBtn.addEventListener('click',function(){showGroupMembersModal(group);});}
    var deleteGrpBtn=document.getElementById('gvDeleteGroupBtn');
    if(deleteGrpBtn){deleteGrpBtn.addEventListener('click',function(){showDeleteGroupModal(group);});}
    bindGvPostEvents();
}

function bindGvPostEvents(){
    $$('#gvPostsFeed .like-btn').forEach(function(btn){btn.addEventListener('click',function(e){if(e.target.classList.contains('like-count'))return;var pid=btn.getAttribute('data-post-id');var countEl=btn.querySelector('.like-count');var count=parseInt(countEl.textContent);var had=!!(state.likedPosts[pid]||state.dislikedPosts[pid]);if(state.likedPosts[pid]){delete state.likedPosts[pid];btn.classList.remove('liked');btn.querySelector('i').className='far fa-thumbs-up';countEl.textContent=count-1;}else{if(state.dislikedPosts[pid]){var db=btn.closest('.action-left').querySelector('.dislike-btn');var dc=db.querySelector('.dislike-count');dc.textContent=parseInt(dc.textContent)-1;delete state.dislikedPosts[pid];db.classList.remove('disliked');db.querySelector('i').className='far fa-thumbs-down';}state.likedPosts[pid]=true;btn.classList.add('liked');btn.querySelector('i').className='fas fa-thumbs-up';countEl.textContent=count+1;}var has=!!(state.likedPosts[pid]||state.dislikedPosts[pid]);if(!had&&has){state.coins++;updateCoins();}else if(had&&!has){state.coins--;updateCoins();}});});
    $$('#gvPostsFeed .dislike-btn').forEach(function(btn){btn.addEventListener('click',function(){var pid=btn.getAttribute('data-post-id');var countEl=btn.querySelector('.dislike-count');var count=parseInt(countEl.textContent);var had=!!(state.likedPosts[pid]||state.dislikedPosts[pid]);if(state.dislikedPosts[pid]){delete state.dislikedPosts[pid];btn.classList.remove('disliked');btn.querySelector('i').className='far fa-thumbs-down';countEl.textContent=count-1;}else{if(state.likedPosts[pid]){var lb=btn.closest('.action-left').querySelector('.like-btn');var lc=lb.querySelector('.like-count');lc.textContent=parseInt(lc.textContent)-1;delete state.likedPosts[pid];lb.classList.remove('liked');lb.querySelector('i').className='far fa-thumbs-up';}state.dislikedPosts[pid]=true;btn.classList.add('disliked');btn.querySelector('i').className='fas fa-thumbs-down';countEl.textContent=count+1;}var has=!!(state.likedPosts[pid]||state.dislikedPosts[pid]);if(!had&&has){state.coins++;updateCoins();}else if(had&&!has){state.coins--;updateCoins();}});});
    $$('#gvPostsFeed .comment-btn').forEach(function(btn){btn.addEventListener('click',function(){var postId=btn.closest('.action-left').querySelector('.like-btn').getAttribute('data-post-id');showComments(postId,btn.querySelector('span'));});});
    bindLikeCountClicks('#gvPostsFeed');
}

function openGroupPostModal(group){
    var html='<div class="create-post-modal"><div class="modal-header"><h3>Post in '+group.name+'</h3><button class="modal-close"><i class="fas fa-times"></i></button></div>';
    html+='<div class="modal-body"><div style="display:flex;align-items:center;gap:10px;padding:16px 20px 0;"><img src="'+$('#profileAvatarImg').src+'" style="width:40px;height:40px;border-radius:50%;"><strong style="font-size:14px;">John Doe</strong></div>';
    html+='<textarea class="cpm-textarea" id="gvCpmText" placeholder="Write something..."></textarea>';
    html+='<div class="cpm-media-zone" id="gvCpmMediaZone"><div class="cpm-media-grid" id="gvCpmGrid"></div><div id="gvCpmDropZone"><i class="fas fa-photo-video"></i><br>Add Photos/Videos</div><input type="file" accept="image/*,video/*" multiple id="gvCpmFileInput" style="display:none;"></div>';
    html+='<div class="cpm-footer"><button class="btn btn-primary" id="gvCpmPublish">Publish</button></div></div></div>';
    showModal(html);
    var mediaList=[];
    var zone=document.getElementById('gvCpmMediaZone'),grid=document.getElementById('gvCpmGrid'),dropZone=document.getElementById('gvCpmDropZone'),fileInput=document.getElementById('gvCpmFileInput');
    dropZone.addEventListener('click',function(){fileInput.click();});
    function renderGrid(){
        grid.innerHTML='';mediaList.forEach(function(m,i){var t=document.createElement('div');t.className='cpm-thumb';t.innerHTML=(m.type==='video'?'<video src="'+m.src+'" muted></video>':'<img src="'+m.src+'">')+'<button class="remove-thumb" data-idx="'+i+'"><i class="fas fa-times"></i></button>';grid.appendChild(t);});
        zone.classList.toggle('has-media',mediaList.length>0);
        grid.querySelectorAll('.remove-thumb').forEach(function(btn){btn.addEventListener('click',function(e){e.stopPropagation();mediaList.splice(parseInt(btn.dataset.idx),1);renderGrid();});});
    }
    fileInput.addEventListener('change',function(){Array.from(this.files).forEach(function(f){var isV=f.type.startsWith('video/');var r=new FileReader();r.onload=function(e){mediaList.push({src:e.target.result,type:isV?'video':'image'});renderGrid();};r.readAsDataURL(f);});this.value='';});
    document.getElementById('gvCpmPublish').addEventListener('click',function(){
        var text=document.getElementById('gvCpmText').value.trim();
        if(!text&&!mediaList.length)return;
        if(!state.groupPosts) state.groupPosts={};
        if(!state.groupPosts[group.id]) state.groupPosts[group.id]=[];
        var mediaHtml='';
        if(mediaList.length>0){var cnt=Math.min(mediaList.length,5);mediaHtml='<div class="post-media-grid pm-count-'+cnt+'">';mediaList.slice(0,5).forEach(function(m){mediaHtml+='<div class="pm-thumb">'+(m.type==='video'?'<video src="'+m.src+'" controls></video>':'<img src="'+m.src+'">')+'</div>';});mediaHtml+='</div>';}
        state.groupPosts[group.id].unshift({name:'John Doe',avatar:$('#profileAvatarImg').src,text:text,media:mediaHtml,time:'just now'});
        state.coins+=5;updateCoins();closeModal();showGroupView(group);
    });
}

// Cover photo upload
$('#coverEditBtn').addEventListener('click',function(e){e.stopPropagation();$('#coverFileInput').click();});
$('#coverFileInput').addEventListener('change',function(){
    var file=this.files[0];
    if(!file) return;
    var reader=new FileReader();
    reader.onload=function(e){
        state.coverPhoto=e.target.result;
        state.photos.cover.unshift({src:e.target.result,date:Date.now()});
        renderPhotosCard();
        applyCoverPhoto();
    };
    reader.readAsDataURL(file);
});
function applyCoverPhoto(){
    if(state.coverPhoto){$('#timelineCover').style.backgroundImage='url('+state.coverPhoto+')';}
}

// View Profile links
$('#viewMyProfile').addEventListener('click',function(e){e.preventDefault();showMyProfileModal();});
$('#dropdownViewProfile').addEventListener('click',function(e){e.preventDefault();$('#userDropdownMenu').classList.remove('show');showMyProfileModal();});

// Edit Profile
$('#editProfileBtn').addEventListener('click',function(e){
    e.preventDefault();
    var name=$('.profile-name').textContent;
    var title=$('.profile-title').textContent;
    var about=$('.profile-about').textContent;
    var html='<div class="modal-header"><h3>Edit Profile</h3><button class="modal-close"><i class="fas fa-times"></i></button></div>';
    html+='<div class="modal-body"><form class="edit-profile-form" id="editProfileForm">';
    html+='<label>Name</label><input type="text" id="editName" value="'+name+'">';
    html+='<label>Status</label><input type="text" id="editTitle" value="'+title+'">';
    html+='<label>About Me</label><textarea id="editAbout">'+about+'</textarea>';
    html+='<div style="display:flex;align-items:center;justify-content:space-between;padding:12px 0;border-top:1px solid var(--border);margin-top:4px;"><div><label style="margin-bottom:0;"><i class="fas fa-lock" style="margin-right:6px;color:var(--gray);"></i>Private Followers</label><p style="font-size:12px;color:var(--gray);margin-top:2px;">Hide your followers and following lists</p></div><label class="toggle-switch"><input type="checkbox" id="editPrivate" '+(state.privateFollowers?'checked':'')+'><span class="toggle-slider"></span></label></div>';
    html+='<button type="submit" class="btn btn-primary btn-block" style="margin-top:12px;">Save</button></form></div>';
    showModal(html);
    $('#editProfileForm').addEventListener('submit',function(ev){
        ev.preventDefault();
        var n=$('#editName').value.trim()||name;
        var t=$('#editTitle').value.trim()||title;
        var a=$('#editAbout').value.trim()||about;
        state.privateFollowers=$('#editPrivate').checked;
        $$('.profile-name').forEach(function(el){el.textContent=n;});
        $('.profile-title').textContent=t;
        $('.profile-about').textContent=a;
        $('.nav-username').textContent=n;
        updateStatClickable();
        closeModal();
    });
});

// Followers / Following modals
function showFollowListModal(title,list,isFollowingList){
    var html='<div class="modal-header"><h3>'+title+'</h3><button class="modal-close"><i class="fas fa-times"></i></button></div><div class="modal-body">';
    if(!list.length){html+='<p style="text-align:center;color:var(--gray);">No one yet.</p>';}
    else{
        html+='<div class="follow-list">';
        list.forEach(function(p){
            var followed=state.followedUsers[p.id];
            var theyFollowMe=myFollowers.indexOf(p.id)!==-1;
            var rel=followed&&theyFollowMe?'Mutual':theyFollowMe?'Follows You':'Not Following You';
            html+='<div class="follow-list-item"><img src="https://i.pravatar.cc/44?img='+p.img+'" alt="'+p.name+'"><div class="follow-list-info"><h4>'+p.name+'</h4><p>'+p.bio+'</p><span style="font-size:11px;color:var(--gray);font-style:italic;">'+rel+'</span></div>';
            html+='<button class="btn follow-btn-small '+(followed?'btn-disabled':'btn-green')+' fl-follow-btn" data-uid="'+p.id+'">'+(followed?'<i class="fas fa-check"></i>':'<i class="fas fa-plus"></i>')+'</button></div>';
        });
        html+='</div>';
    }
    html+='</div>';
    showModal(html);
    $$('.fl-follow-btn').forEach(function(btn){btn.addEventListener('click',function(){toggleFollow(+btn.dataset.uid,btn);});});
}
$('#followingStat').addEventListener('click',function(){
    var list=people.filter(function(p){return state.followedUsers[p.id];});
    showFollowListModal('Following',list,true);
});
$('#followersStat').addEventListener('click',function(){
    var list=myFollowers.map(function(id){return people.find(function(p){return p.id===id;});});
    showFollowListModal('Followers',list,false);
});

// Avatar photo upload with crop
$('#avatarEditBtn').addEventListener('click',function(e){e.stopPropagation();$('#avatarFileInput').click();});
$('#avatarFileInput').addEventListener('change',function(){
    var file=this.files[0];
    if(!file) return;
    var reader=new FileReader();
    reader.onload=function(e){showCropModal(e.target.result);};
    reader.readAsDataURL(file);
});

function showCropModal(src){
    var html='<div class="modal-header"><h3>Crop Photo</h3><button class="modal-close"><i class="fas fa-times"></i></button></div>';
    html+='<div class="modal-body" style="text-align:center;"><div class="crop-container" id="cropContainer"><img src="'+src+'" id="cropImg"><div class="crop-box" id="cropBox"><div class="crop-resize" id="cropResize"></div></div></div>';
    html+='<div style="margin-top:16px;"><button class="btn btn-primary" id="cropConfirmBtn">Apply</button></div></div>';
    showModal(html);

    var img=document.getElementById('cropImg');
    var box=document.getElementById('cropBox');
    var container=document.getElementById('cropContainer');
    var resizeHandle=document.getElementById('cropResize');

    img.onload=function(){
        var size=Math.min(img.clientWidth,img.clientHeight,200);
        box.style.width=size+'px';box.style.height=size+'px';
        box.style.left=((img.clientWidth-size)/2)+'px';box.style.top=((img.clientHeight-size)/2)+'px';
    };

    var dragging=false,resizing=false,startX,startY,startL,startT,startW,startH;

    box.addEventListener('mousedown',function(e){
        if(e.target===resizeHandle) return;
        dragging=true;startX=e.clientX;startY=e.clientY;startL=box.offsetLeft;startT=box.offsetTop;e.preventDefault();
    });
    resizeHandle.addEventListener('mousedown',function(e){
        resizing=true;startX=e.clientX;startY=e.clientY;startW=box.offsetWidth;startH=box.offsetHeight;e.preventDefault();e.stopPropagation();
    });
    document.addEventListener('mousemove',function onMove(e){
        if(dragging){
            var dx=e.clientX-startX,dy=e.clientY-startY;
            var nl=Math.max(0,Math.min(startL+dx,img.clientWidth-box.offsetWidth));
            var nt=Math.max(0,Math.min(startT+dy,img.clientHeight-box.offsetHeight));
            box.style.left=nl+'px';box.style.top=nt+'px';
        }
        if(resizing){
            var d=Math.max(e.clientX-startX,e.clientY-startY);
            var ns=Math.max(40,Math.min(startW+d,img.clientWidth-box.offsetLeft,img.clientHeight-box.offsetTop));
            box.style.width=ns+'px';box.style.height=ns+'px';
        }
    });
    document.addEventListener('mouseup',function(){dragging=false;resizing=false;});

    document.getElementById('cropConfirmBtn').addEventListener('click',function(){
        var canvas=document.createElement('canvas');
        var scaleX=img.naturalWidth/img.clientWidth;
        var scaleY=img.naturalHeight/img.clientHeight;
        var sx=box.offsetLeft*scaleX,sy=box.offsetTop*scaleY,sw=box.offsetWidth*scaleX,sh=box.offsetHeight*scaleY;
        canvas.width=400;canvas.height=400;
        var ctx=canvas.getContext('2d');
        ctx.drawImage(img,sx,sy,sw,sh,0,0,400,400);
        var url=canvas.toDataURL('image/png');
        $('#profileAvatarImg').src=url;
        $('.nav-avatar').src=url;
        $('.post-create-avatar').src=url;
        state.photos.profile.unshift({src:url,date:Date.now()});
        renderPhotosCard();
        closeModal();
    });
}

// Settings & dropdown handlers
var settings={darkMode:false,notifSound:true,privateProfile:false,autoplay:true,commentOrder:localStorage.getItem('commentOrder')||'top'};
function settingsToggle(key){return '<label style="display:flex;align-items:center;justify-content:space-between;padding:10px 0;border-bottom:1px solid var(--border);cursor:pointer;"><span style="font-size:14px;">'+{darkMode:'Dark Mode',notifSound:'Notification Sounds',privateProfile:'Private Profile',autoplay:'Autoplay Videos'}[key]+'</span><span class="stoggle" data-key="'+key+'" style="width:42px;height:24px;border-radius:12px;background:'+(settings[key]?'var(--green)':'#ccc')+';position:relative;display:inline-block;transition:background .2s;"><span style="width:20px;height:20px;border-radius:50%;background:#fff;position:absolute;top:2px;'+(settings[key]?'left:20px':'left:2px')+';transition:left .2s;box-shadow:0 1px 3px rgba(0,0,0,.2);"></span></span></label>';}
document.addEventListener('click',function(e){
    var a=e.target.closest('.user-dropdown a');
    if(a){
        var text=a.textContent.trim();
        if(text==='My Coins'){
            e.preventDefault();
            $('#userDropdownMenu').classList.remove('show');
            showModal('<div class="modal-header"><h3>My Coins</h3><button class="modal-close"><i class="fas fa-times"></i></button></div><div class="modal-body" style="text-align:center;"><div style="font-size:48px;color:#f59e0b;margin-bottom:8px;"><i class="fas fa-coins"></i></div><div style="font-size:32px;font-weight:700;color:var(--dark);margin-bottom:4px;">'+state.coins+'</div><p style="color:var(--gray);font-size:14px;margin-bottom:16px;">Earn coins by liking posts. Spend them in the Skin Shop!</p><div style="display:flex;gap:8px;justify-content:center;"><button class="btn btn-primary" data-page="shop">Visit Shop</button></div></div>');
        }
        if(text==='Settings'){
            e.preventDefault();
            $('#userDropdownMenu').classList.remove('show');
            var h='<div class="modal-header"><h3>Settings</h3><button class="modal-close"><i class="fas fa-times"></i></button></div><div class="modal-body">';
            h+=settingsToggle('darkMode')+settingsToggle('notifSound')+settingsToggle('privateProfile')+settingsToggle('autoplay');
            h+='<label style="display:flex;align-items:center;justify-content:space-between;padding:10px 0;border-bottom:1px solid var(--border);"><span style="font-size:14px;">Comment Order</span><select id="commentOrderSelect" style="padding:6px 10px;border:1px solid var(--border);border-radius:8px;font-size:13px;background:#fff;color:var(--dark);cursor:pointer;"><option value="top"'+(settings.commentOrder==='top'?' selected':'')+'>Top</option><option value="newest"'+(settings.commentOrder==='newest'?' selected':'')+'>Newest</option><option value="oldest"'+(settings.commentOrder==='oldest'?' selected':'')+'>Oldest</option></select></label>';
            var hiddenCount=Object.keys(hiddenPosts).length;
            h+='<div style="display:flex;align-items:center;justify-content:space-between;padding:10px 0;border-bottom:1px solid var(--border);"><span style="font-size:14px;">Hidden Posts</span><button class="btn btn-outline" id="settingsViewHidden" style="padding:4px 14px;font-size:12px;">View ('+hiddenCount+')</button></div>';
            var blockedCount=Object.keys(blockedUsers).length;
            h+='<div style="display:flex;align-items:center;justify-content:space-between;padding:10px 0;border-bottom:1px solid var(--border);"><span style="font-size:14px;">Blocked Users</span><button class="btn btn-outline" id="settingsViewBlocked" style="padding:4px 14px;font-size:12px;color:#e74c3c;border-color:#e74c3c;">View ('+blockedCount+')</button></div>';
            h+='<div style="margin-top:16px;text-align:center;"><button class="btn btn-primary modal-close">Done</button></div></div>';
            showModal(h);
            document.getElementById('settingsViewHidden').addEventListener('click',function(){showHiddenPostsModal();});
            document.getElementById('settingsViewBlocked').addEventListener('click',function(){showBlockedUsersModal();});
            document.getElementById('commentOrderSelect').addEventListener('change',function(){settings.commentOrder=this.value;localStorage.setItem('commentOrder',this.value);});
            $$('.stoggle').forEach(function(t){t.style.cursor='pointer';t.addEventListener('click',function(){
                var k=t.dataset.key;settings[k]=!settings[k];
                t.style.background=settings[k]?'var(--green)':'#ccc';
                t.firstElementChild.style.left=settings[k]?'20px':'2px';
                if(k==='darkMode'){document.body.style.background=settings[k]?'#1a1a2e':'';document.body.style.color=settings[k]?'#eee':'';}
            });});
        }
        if(text==='Logout'){
            e.preventDefault();
            $('#userDropdownMenu').classList.remove('show');
            showModal('<div class="modal-header"><h3>Logout</h3><button class="modal-close"><i class="fas fa-times"></i></button></div><div class="modal-body"><p style="color:#777;text-align:center;margin-bottom:16px;">Are you sure you want to logout?</p><div class="modal-actions"><button class="btn btn-primary modal-close">Stay</button><button class="btn btn-outline" id="logoutConfirm">Logout</button></div></div>');
            document.getElementById('logoutConfirm').addEventListener('click',function(){closeModal();authClearSession();showLogin();});
        }
    }
});

// ======================== GENERATE FEED (100 POSTS) ========================
var feedPosts=[];
var activeFeedTab='following';
var feedPostImages={
    0:['https://picsum.photos/seed/hike1/800/600'],
    3:['https://picsum.photos/seed/puppy1/800/600','https://picsum.photos/seed/puppy2/800/600'],
    5:['https://picsum.photos/seed/ramen1/800/600','https://picsum.photos/seed/ramen2/800/600','https://picsum.photos/seed/ramen3/800/600'],
    11:['https://picsum.photos/seed/beach1/800/600','https://picsum.photos/seed/beach2/800/600','https://picsum.photos/seed/beach3/800/600','https://picsum.photos/seed/beach4/800/600'],
    14:['https://picsum.photos/seed/fest1/800/600','https://picsum.photos/seed/fest2/800/600','https://picsum.photos/seed/fest3/800/600','https://picsum.photos/seed/fest4/800/600','https://picsum.photos/seed/fest5/800/600']
};
function generatePosts(){
    feedPosts=[];
    for(var i=0;i<100;i++){
        var person=people[i%people.length];
        var likes=Math.floor(Math.random()*people.length);
        feedPosts.push({idx:i,person:person,text:postTexts[i%postTexts.length],tags:tagSets[i%tagSets.length],badge:badgeTypes[i%badgeTypes.length],loc:locations[i%locations.length],likes:likes,comments:getComments(i),shares:Math.floor(Math.random()*10),images:feedPostImages[i%postTexts.length]||null});
    }
    renderFeed(activeFeedTab);
}
function getFollowingIds(){
    var ids={};
    Object.keys(state.followedUsers).forEach(function(k){ids[k]=true;});
    groups.forEach(function(g){if(state.joinedGroups[g.id]&&g.memberIds){g.memberIds.forEach(function(id){ids[id]=true;});}});
    return ids;
}
function renderFeed(tab){
    activeFeedTab=tab;
    var posts;
    if(tab==='following'){
        var ids=getFollowingIds();
        posts=feedPosts.filter(function(p){return ids[p.person.id]&&!hiddenPosts[p.idx]&&!blockedUsers[p.person.id];});
    } else {
        posts=feedPosts.filter(function(p){return !hiddenPosts[p.idx]&&!blockedUsers[p.person.id];}).sort(function(a,b){return b.likes-a.likes;});
    }
    var container=$('#feedContainer');
    var html='';
    posts.forEach(function(p){
        var i=p.idx,person=p.person,text=p.text,tags=p.tags,badge=p.badge,loc=p.loc,likes=p.likes,genComments=p.comments,shares=p.shares;
        var menuId='post-menu-'+i;
        var short=text.substring(0,Math.min(160,text.length));var rest=text.substring(160);var hasMore=rest.length>0;
        html+='<div class="card feed-post">';
        html+='<div class="post-header">';
        html+='<img src="https://i.pravatar.cc/50?img='+person.img+'" alt="'+person.name+'" class="post-avatar" data-person-id="'+person.id+'">';
        html+='<div class="post-user-info"><div class="post-user-top"><h4 class="post-username" data-person-id="'+person.id+'">'+person.name+'</h4><span class="post-time">'+timeAgo(i)+'</span></div>';
        html+='<div class="post-badges"><span class="badge '+badge.cls+'"><i class="fas '+badge.icon+'"></i> '+badge.text+'</span><span class="badge badge-blue"><i class="fas fa-map-marker-alt"></i> '+loc+'</span></div></div>';
        html+='<button class="post-menu-btn" data-menu="'+menuId+'"><i class="fas fa-ellipsis-h"></i></button>';
        html+='<div class="post-dropdown" id="'+menuId+'"><a href="#" data-action="save" data-pid="'+i+'"><i class="fas fa-bookmark"></i> Save Post</a><a href="#" data-action="report" data-pid="'+i+'"><i class="fas fa-flag"></i> Report</a><a href="#" data-action="hide" data-pid="'+i+'"><i class="fas fa-eye-slash"></i> Hide</a></div>';
        html+='</div>';
        html+='<div class="post-description"><p>'+short+(hasMore?'<span class="view-more-text hidden">'+rest+'</span>':'')+'</p>'+(hasMore?'<button class="view-more-btn">view more</button>':'')+'</div>';
        html+='<div class="post-tags">';
        tags.forEach(function(t){html+='<span class="skill-tag">'+t+'</span>';});
        html+='</div>';
        if(p.images){var imgs=p.images;html+='<div class="post-media-grid pm-count-'+imgs.length+'">';imgs.forEach(function(src){html+='<div class="pm-thumb"><img src="'+src+'" alt="Post photo"></div>';});html+='</div>';}
        var likers=getLikers(i,likes);
        html+='<div class="post-actions"><div class="action-left">';
        html+='<button class="action-btn like-btn" data-post-id="'+i+'"><i class="'+(state.likedPosts[i]?'fas':'far')+' fa-thumbs-up"></i><span class="like-count">'+likes+'</span></button>';
        html+='<button class="action-btn dislike-btn" data-post-id="'+i+'"><i class="'+(state.dislikedPosts[i]?'fas':'far')+' fa-thumbs-down"></i><span class="dislike-count">0</span></button>';
        html+='<button class="action-btn comment-btn"><i class="far fa-comment"></i><span>'+genComments.length+'</span></button>';
        html+='<button class="action-btn share-btn"><i class="fas fa-share-from-square"></i><span>'+shares+'</span></button>';
        html+='</div><div class="action-right"><div class="liked-avatars" data-post-id="'+i+'">';
        for(var a=0;a<Math.min(3,likers.length);a++){html+='<img src="https://i.pravatar.cc/24?img='+likers[a].img+'" alt="'+likers[a].name+'">';}
        html+='</div></div></div>';
        html+='<div class="post-comments" data-post-id="'+i+'"></div>';
        html+='</div>';
    });
    container.innerHTML=html;
    bindPostEvents();
    posts.forEach(function(p){renderInlineComments(p.idx);});
    // Update tab active state
    $$('#feedTabs .search-tab').forEach(function(t){t.classList.toggle('active',t.dataset.feedtab===tab);});
}
// Feed tab clicks
document.getElementById('feedTabs').addEventListener('click',function(e){
    var tab=e.target.closest('[data-feedtab]');
    if(tab&&tab.dataset.feedtab!==activeFeedTab) renderFeed(tab.dataset.feedtab);
});

function bindPostEvents(){
    var _fc=document.getElementById('feedContainer');
    function _$$(sel){return Array.from(_fc.querySelectorAll(sel));}
    // Like buttons
    _$$('.like-btn').forEach(function(btn){
        btn.addEventListener('click',function(e){
            if(e.target.classList.contains('like-count')) return;
            var postId=btn.getAttribute('data-post-id');
            var countEl=btn.querySelector('.like-count');
            var count=parseInt(countEl.textContent);
            var had=!!(state.likedPosts[postId]||state.dislikedPosts[postId]);
            if(state.likedPosts[postId]){
                delete state.likedPosts[postId];
                btn.classList.remove('liked');
                btn.querySelector('i').className='far fa-thumbs-up';
                countEl.textContent=count-1;
            } else {
                if(state.dislikedPosts[postId]){var db=btn.closest('.action-left').querySelector('.dislike-btn');var dc=db.querySelector('.dislike-count');dc.textContent=parseInt(dc.textContent)-1;delete state.dislikedPosts[postId];db.classList.remove('disliked');db.querySelector('i').className='far fa-thumbs-down';}
                state.likedPosts[postId]=true;
                btn.classList.add('liked');
                btn.querySelector('i').className='fas fa-thumbs-up';
                countEl.textContent=count+1;
            }
            var has=!!(state.likedPosts[postId]||state.dislikedPosts[postId]);
            if(!had&&has){state.coins++;updateCoins();}else if(had&&!has){state.coins--;updateCoins();}
        });
    });

    // Dislike buttons
    _$$('.dislike-btn').forEach(function(btn){
        btn.addEventListener('click',function(){
            var postId=btn.getAttribute('data-post-id');
            var countEl=btn.querySelector('.dislike-count');
            var count=parseInt(countEl.textContent);
            var had=!!(state.likedPosts[postId]||state.dislikedPosts[postId]);
            if(state.dislikedPosts[postId]){
                delete state.dislikedPosts[postId];
                btn.classList.remove('disliked');
                btn.querySelector('i').className='far fa-thumbs-down';
                countEl.textContent=count-1;
            } else {
                if(state.likedPosts[postId]){var lb=btn.closest('.action-left').querySelector('.like-btn');var lc=lb.querySelector('.like-count');lc.textContent=parseInt(lc.textContent)-1;delete state.likedPosts[postId];lb.classList.remove('liked');lb.querySelector('i').className='far fa-thumbs-up';}
                state.dislikedPosts[postId]=true;
                btn.classList.add('disliked');
                btn.querySelector('i').className='fas fa-thumbs-down';
                countEl.textContent=count+1;
            }
            var has=!!(state.likedPosts[postId]||state.dislikedPosts[postId]);
            if(!had&&has){state.coins++;updateCoins();}else if(had&&!has){state.coins--;updateCoins();}
        });
    });

    // View more
    _$$('.view-more-btn').forEach(function(btn){
        btn.addEventListener('click',function(){
            var span=btn.parentElement.querySelector('.view-more-text');
            if(span.classList.contains('hidden')){span.classList.remove('hidden');btn.textContent='view less';}
            else{span.classList.add('hidden');btn.textContent='view more';}
        });
    });

    // Post menus
    _$$('.post-menu-btn').forEach(function(btn){
        btn.addEventListener('click',function(e){
            e.stopPropagation();
            var menuId=btn.getAttribute('data-menu');
            var menu=document.getElementById(menuId);
            _$$('.post-dropdown.show').forEach(function(m){if(m!==menu)m.classList.remove('show');});
            menu.classList.toggle('show');
        });
    });

    // Post menu actions
    _$$('.post-dropdown a').forEach(function(a){
        a.addEventListener('click',function(e){
            e.preventDefault();
            a.closest('.post-dropdown').classList.remove('show');
            var pid=a.dataset.pid;
            var action=a.dataset.action;
            if(action==='save') showSaveModal(pid);
            else if(action==='report') showReportModal(pid);
            else if(action==='hide') hidePost(pid);
        });
    });

    // Click username/avatar to view profile
    _$$('.post-username, .post-avatar').forEach(function(el){
        el.addEventListener('click',function(){
            var pid=parseInt(el.getAttribute('data-person-id'));
            var person=people.find(function(p){return p.id===pid;});
            if(person) showProfileModal(person);
        });
    });

    // Comment buttons
    _$$('.comment-btn').forEach(function(btn){
        btn.addEventListener('click',function(){
            var postId=btn.closest('.action-left').querySelector('.like-btn').getAttribute('data-post-id');
            showComments(postId,btn.querySelector('span'));
        });
    });

    // Share buttons
    _$$('.share-btn').forEach(function(btn){btn.addEventListener('click',function(){handleShare(btn);});});

    // Tag clicks
    _$$('.skill-tag').forEach(function(tag){
        tag.addEventListener('click',function(){
            showModal('<div class="modal-header"><h3>'+tag.textContent+'</h3><button class="modal-close"><i class="fas fa-times"></i></button></div><div class="modal-body"><p style="text-align:center;color:#777;">Showing all posts tagged with '+tag.textContent+'</p></div>');
        });
    });

    // Like count click to show likers
    bindLikeCountClicks('#feedContainer');
}

function showLikersModal(postId){
    var likers=postLikers[postId];
    if(!likers||likers.length===0) return;
    var publicLikers=likers.filter(function(p){return !p.priv;});
    var privateCt=likers.length-publicLikers.length;
    var h='<div class="modal-header"><h3><i class="fas fa-thumbs-up" style="color:var(--primary);margin-right:8px;"></i>Liked by</h3><button class="modal-close"><i class="fas fa-times"></i></button></div><div class="modal-body"><ul class="follow-list" style="max-height:400px;overflow-y:auto;">';
    publicLikers.forEach(function(p){
        h+='<li class="follow-list-item"><img src="https://i.pravatar.cc/44?img='+p.img+'" alt="'+p.name+'"><div class="follow-list-info"><h4>'+p.name+'</h4><p>'+p.bio+'</p></div></li>';
    });
    if(privateCt>0){
        h+='<li class="follow-list-item" style="opacity:.5;"><div style="width:44px;height:44px;border-radius:50%;background:#e0e0e0;display:flex;align-items:center;justify-content:center;"><i class="fas fa-lock" style="color:#999;"></i></div><div class="follow-list-info"><h4>'+privateCt+' private user'+(privateCt>1?'s':'')+'</h4><p>Followers set to private</p></div></li>';
    }
    h+='</ul></div>';
    showModal(h);
}

function bindLikeCountClicks(containerSelector){
    var container=document.querySelector(containerSelector);
    if(!container) return;
    container.querySelectorAll('.like-count').forEach(function(el){
        el.addEventListener('click',function(e){
            e.stopPropagation();
            var postId=el.closest('.like-btn').getAttribute('data-post-id');
            showLikersModal(postId);
        });
    });
}

// ======================== POST CREATION ========================
$('#openPostModal').addEventListener('click',function(){
    var html='<div class="create-post-modal"><div class="modal-header"><h3>Create a Post</h3><button class="modal-close"><i class="fas fa-times"></i></button></div>';
    html+='<div class="modal-body"><div style="display:flex;align-items:center;gap:10px;padding:16px 20px 0;"><img src="'+$('#profileAvatarImg').src+'" style="width:40px;height:40px;border-radius:50%;"><strong style="font-size:14px;">John Doe</strong></div>';
    html+='<textarea class="cpm-textarea" id="cpmText" placeholder="Write something..."></textarea>';
    html+='<div class="cpm-media-zone" id="cpmMediaZone"><div class="cpm-media-grid" id="cpmGrid"></div><div id="cpmDropZone"><i class="fas fa-photo-video"></i><br>Add Photos/Videos</div><input type="file" accept="image/*,video/*" multiple id="cpmFileInput" style="display:none;"></div>';
    html+='<div class="cpm-tags-section"><div class="cpm-tags-wrap" id="cpmTagsWrap"></div></div>';
    html+='<div class="cpm-link-section"><div class="cpm-link-toggle" id="cpmLinkToggle"><i class="fas fa-link"></i> Add Link Preview</div><div class="cpm-link-fields" id="cpmLinkFields" style="display:none;"><input type="text" class="cpm-link-input" id="cpmLinkUrl" placeholder="URL (e.g. https://example.com)"><input type="text" class="cpm-link-input" id="cpmLinkTitle" placeholder="Title"><input type="text" class="cpm-link-input" id="cpmLinkDesc" placeholder="Description"><div class="cpm-link-img-upload" id="cpmLinkImgUpload"><i class="fas fa-image"></i> Add Preview Image</div><input type="file" accept="image/*" id="cpmLinkImgInput" style="display:none;"><img id="cpmLinkImgPreview" style="display:none;" class="cpm-link-img-preview"></div></div>';
    html+='<div class="cpm-footer"><button class="btn btn-primary" id="cpmPublish">Publish</button></div></div></div>';
    showModal(html);
    var mediaList=[];
    var linkImgSrc='';
    var zone=document.getElementById('cpmMediaZone');
    var grid=document.getElementById('cpmGrid');
    var dropZone=document.getElementById('cpmDropZone');
    var fileInput=document.getElementById('cpmFileInput');
    dropZone.addEventListener('click',function(){fileInput.click();});
    function renderGrid(){
        grid.innerHTML='';
        mediaList.forEach(function(m,i){
            var thumb=document.createElement('div');thumb.className='cpm-thumb';
            thumb.innerHTML=(m.type==='video'?'<video src="'+m.src+'" muted></video>':'<img src="'+m.src+'">')+'<button class="remove-thumb" data-idx="'+i+'"><i class="fas fa-times"></i></button>';
            grid.appendChild(thumb);
        });
        zone.classList.toggle('has-media',mediaList.length>0);
        grid.querySelectorAll('.remove-thumb').forEach(function(btn){btn.addEventListener('click',function(e){e.stopPropagation();mediaList.splice(parseInt(btn.dataset.idx),1);renderGrid();});});
    }
    fileInput.addEventListener('change',function(){
        var files=Array.from(this.files);
        files.forEach(function(f){
            var isV=f.type.startsWith('video/');
            var r=new FileReader();
            r.onload=function(e){mediaList.push({src:e.target.result,type:isV?'video':'image'});renderGrid();};
            r.readAsDataURL(f);
        });
        this.value='';
    });
    document.getElementById('cpmLinkToggle').addEventListener('click',function(){var f=document.getElementById('cpmLinkFields');f.style.display=f.style.display==='none'?'flex':'none';});
    document.getElementById('cpmLinkImgUpload').addEventListener('click',function(){document.getElementById('cpmLinkImgInput').click();});
    document.getElementById('cpmLinkImgInput').addEventListener('change',function(){var file=this.files[0];if(!file)return;var r=new FileReader();r.onload=function(e){linkImgSrc=e.target.result;var prev=document.getElementById('cpmLinkImgPreview');prev.src=linkImgSrc;prev.style.display='block';};r.readAsDataURL(file);});
    // Hashtag system — auto-extract #tags from textarea on space/enter
    var postTags=[];
    function renderPostTags(){
        var wrap=document.getElementById('cpmTagsWrap');
        wrap.innerHTML='';
        postTags.forEach(function(t,i){
            wrap.innerHTML+='<span class="cpm-tag-chip"><span>#'+t+'</span><button class="cpm-tag-remove" data-idx="'+i+'"><i class="fas fa-times"></i></button></span>';
        });
        wrap.querySelectorAll('.cpm-tag-remove').forEach(function(btn){
            btn.addEventListener('click',function(){postTags.splice(parseInt(btn.dataset.idx),1);renderPostTags();});
        });
    }
    document.getElementById('cpmText').addEventListener('input',function(){
        var ta=this;
        var text=ta.value;
        // Match a completed hashtag (followed by space or newline)
        var match=text.match(/#([a-zA-Z0-9_]+)[\s\n]/);
        if(match && postTags.length<10){
            var tag=match[1].toLowerCase();
            if(postTags.indexOf(tag)===-1){
                postTags.push(tag);
                renderPostTags();
            }
            // Remove the #tag from the textarea text
            ta.value=text.replace('#'+match[1],'').replace(/\s{2,}/g,' ');
        }
    });
    document.getElementById('cpmPublish').addEventListener('click',function(){
        var text=document.getElementById('cpmText').value.trim();
        var linkUrl=document.getElementById('cpmLinkUrl').value.trim();
        var linkTitle=document.getElementById('cpmLinkTitle').value.trim();
        var linkDesc=document.getElementById('cpmLinkDesc').value.trim();
        if(!text&&!mediaList.length&&!linkUrl)return;
        var container=$('#feedContainer');
        var mediaHtml='';
        if(mediaList.length>0){
            var pid='pg-'+Date.now();
            var cnt=Math.min(mediaList.length,5);
            mediaHtml='<div class="post-media-grid pm-count-'+cnt+'" data-pgid="'+pid+'">';
            var shown=mediaList.slice(0,5);var extra=mediaList.length-5;
            shown.forEach(function(m,i){
                if(i===4&&extra>0){
                    mediaHtml+='<div class="pm-thumb pm-more" data-pgid="'+pid+'"><img src="'+m.src+'"><div class="pm-more-overlay">+'+extra+'</div></div>';
                } else {
                    mediaHtml+='<div class="pm-thumb">'+(m.type==='video'?'<video src="'+m.src+'" controls></video>':'<img src="'+m.src+'">')+'</div>';
                }
            });
            mediaHtml+='</div>';
            window['_media_'+pid]=mediaList;
            mediaList.forEach(function(m){if(m.type==='image')state.photos.post.unshift({src:m.src,date:Date.now()});});
            renderPhotosCard();
        }
        var linkHtml='';
        if(linkUrl){
            linkHtml='<a href="'+linkUrl+'" target="_blank" class="link-preview">';
            if(linkImgSrc){linkHtml+='<img src="'+linkImgSrc+'" class="link-preview-image">';}
            linkHtml+='<div class="link-preview-info">';
            if(linkTitle){linkHtml+='<div class="link-preview-title">'+linkTitle+'</div>';}
            linkHtml+='<div class="link-preview-url">'+linkUrl+'</div>';
            if(linkDesc){linkHtml+='<div class="link-preview-desc">'+linkDesc+'</div>';}
            linkHtml+='</div></a>';
        }
        var postHtml='<div class="card feed-post"><div class="post-header"><img src="https://i.pravatar.cc/50?img=12" alt="You" class="post-avatar">';
        postHtml+='<div class="post-user-info"><div class="post-user-top"><h4 class="post-username">John Doe</h4><span class="post-time">just now</span></div>';
        postHtml+='<div class="post-badges"><span class="badge badge-green"><i class="fas fa-user"></i> You</span></div></div></div>';
        var tagsHtml='';
        if(postTags.length>0){tagsHtml='<div class="post-tags">';postTags.forEach(function(t){tagsHtml+='<span class="skill-tag">#'+t+'</span>';});tagsHtml+='</div>';}
        postHtml+='<div class="post-description">'+(text?'<p>'+text.replace(/</g,'&lt;').replace(/>/g,'&gt;')+'</p>':'')+mediaHtml+linkHtml+'</div>'+tagsHtml;
        var myPostId='my-'+Date.now();
        postHtml+='<div class="post-actions"><div class="action-left"><button class="action-btn like-btn" data-post-id="'+myPostId+'"><i class="far fa-thumbs-up"></i><span class="like-count">0</span></button>';
        postHtml+='<button class="action-btn dislike-btn" data-post-id="'+myPostId+'"><i class="far fa-thumbs-down"></i><span class="dislike-count">0</span></button>';
        postHtml+='<button class="action-btn comment-btn"><i class="far fa-comment"></i><span>0</span></button>';
        postHtml+='<button class="action-btn share-btn"><i class="fas fa-share-from-square"></i><span>0</span></button></div></div></div>';
        container.insertAdjacentHTML('afterbegin',postHtml);
        state.coins+=5;updateCoins();
        closeModal();
        var newPost=container.firstElementChild;
        var likeBtn=newPost.querySelector('.like-btn');
        likeBtn.addEventListener('click',function(){var countEl=likeBtn.querySelector('.like-count');var count=parseInt(countEl.textContent);var pid=likeBtn.getAttribute('data-post-id');if(state.likedPosts[pid]){delete state.likedPosts[pid];likeBtn.classList.remove('liked');likeBtn.querySelector('i').className='far fa-thumbs-up';countEl.textContent=count-1;state.coins--;updateCoins();}else{state.likedPosts[pid]=true;likeBtn.classList.add('liked');likeBtn.querySelector('i').className='fas fa-thumbs-up';countEl.textContent=count+1;state.coins++;updateCoins();}});
        var dislikeBtn=newPost.querySelector('.dislike-btn');
        dislikeBtn.addEventListener('click',function(){var countEl=dislikeBtn.querySelector('.dislike-count');var count=parseInt(countEl.textContent);var pid=dislikeBtn.getAttribute('data-post-id');if(state.dislikedPosts[pid]){delete state.dislikedPosts[pid];dislikeBtn.classList.remove('disliked');dislikeBtn.querySelector('i').className='far fa-thumbs-down';countEl.textContent=count-1;}else{state.dislikedPosts[pid]=true;dislikeBtn.classList.add('disliked');dislikeBtn.querySelector('i').className='fas fa-thumbs-down';countEl.textContent=count+1;}});
        newPost.querySelector('.comment-btn').addEventListener('click',function(){var postId=newPost.querySelector('.like-btn').getAttribute('data-post-id');showComments(postId,newPost.querySelector('.comment-btn span'));});
        newPost.querySelector('.share-btn').addEventListener('click',function(){handleShare(newPost.querySelector('.share-btn'));});
        var moreBtn=newPost.querySelector('.pm-more');
        if(moreBtn){moreBtn.addEventListener('click',function(){showAllMedia(moreBtn.dataset.pgid,4);});}
    });
});
function showAllMedia(pgid,startIdx){
    var list=window['_media_'+pgid];if(!list)return;
    var imgs=list.filter(function(m){return m.type==='image';}).map(function(m){return m.src;});
    if(imgs.length) window._openLightbox(imgs,startIdx||0);
}

// ======================== SUGGESTIONS ========================
function getRankedSuggestions(limit){
    var myF=Object.keys(state.followedUsers).map(Number);
    return getFriendsOfFollowed().map(function(p){
        var mutual=(personFollowers[p.id]||[]).filter(function(id){return myF.indexOf(id)!==-1;}).length;
        return{person:p,mutual:mutual};
    }).sort(function(a,b){return b.mutual-a.mutual;}).slice(0,limit||5).map(function(o){return o.person;});
}
function renderSuggestions(){
    var html='';
    getRankedSuggestions(5).forEach(function(p){
        var followed=state.followedUsers[p.id];
        html+='<div class="suggestion-item"><img src="https://i.pravatar.cc/40?img='+p.img+'" alt="'+p.name+'" class="suggestion-avatar">';
        html+='<div class="suggestion-info"><span class="suggestion-name" data-person-id="'+p.id+'">'+p.name+'</span><span class="suggestion-role">'+p.bio+'</span></div>';
        html+='<button class="follow-btn-small'+(followed?' followed':'')+'" data-uid="'+p.id+'">'+(followed?'<i class="fas fa-check"></i>':'<i class="fas fa-plus"></i>')+'</button></div>';
    });
    $('#suggestionList').innerHTML=html;

    $$('#suggestionList .follow-btn-small').forEach(function(btn){
        btn.addEventListener('click',function(){
            var uid=parseInt(btn.getAttribute('data-uid'));
            toggleFollow(uid,btn);
        });
    });
    $$('#suggestionList .suggestion-name').forEach(function(el){
        el.addEventListener('click',function(){
            var pid=parseInt(el.getAttribute('data-person-id'));
            var person=people.find(function(p){return p.id===pid;});
            if(person) showProfileModal(person);
        });
    });
}

// ======================== TRENDING GROUPS SIDEBAR ========================
function renderTrendingSidebar(){
    var html='';
    groups.slice(0,4).forEach(function(g){
        html+='<div class="group-item" data-gid="'+g.id+'"><div class="group-icon" style="background:'+g.color+'22;color:'+g.color+';"><i class="fas '+g.icon+'"></i></div>';
        html+='<div class="group-info"><h5 class="group-name">'+g.name+'</h5><p class="group-desc">'+g.desc+'</p>';
        html+='<span class="group-members"><i class="fas fa-users"></i> '+fmtNum(g.members)+' members</span></div></div>';
    });
    $('#trendingGroupsSidebar').innerHTML=html;
    $$('#trendingGroupsSidebar .group-item').forEach(function(el){
        el.addEventListener('click',function(){
            var gid=parseInt(el.getAttribute('data-gid'));
            var group=groups.find(function(g){return g.id===gid;});
            if(group) showGroupView(group);
        });
    });
}

// ======================== GROUPS PAGE ========================
function groupCardHtml(g){
    var joined=state.joinedGroups[g.id];
    return '<div class="group-card" data-gid="'+g.id+'"><div class="group-card-banner" style="background:'+g.color+';"><i class="fas '+g.icon+'"></i></div><div class="group-card-body"><h4>'+g.name+'</h4><p>'+g.desc+'</p><span class="group-members"><i class="fas fa-users"></i> '+fmtNum(g.members)+' members</span></div><div class="group-card-actions"><button class="btn '+(joined?'btn-disabled':'btn-primary')+' join-group-btn" data-gid="'+g.id+'">'+(joined?'Joined':'Join')+'</button><button class="btn btn-outline view-group-btn" data-gid="'+g.id+'">View</button></div></div>';
}
var currentGroupTab=null;
function getGroupCategories(filter){
    var cats=[];
    var filtered=filter?groups.filter(function(g){return g.name.toLowerCase().indexOf(filter.toLowerCase())!==-1||g.desc.toLowerCase().indexOf(filter.toLowerCase())!==-1;}):groups;
    var yourGroups=[],modGroups=[],joinedGroups=[],recommended=[];
    filtered.forEach(function(g){
        var mr=getMyGroupRole(g);
        if(g.createdBy==='me') yourGroups.push(g);
        else if(mr==='Co-Admin'||mr==='Moderator') modGroups.push(g);
        else if(state.joinedGroups[g.id]) joinedGroups.push(g);
        else recommended.push(g);
    });
    if(yourGroups.length) cats.push({key:'yours',label:'<i class="fas fa-crown"></i> My Groups',items:yourGroups});
    if(modGroups.length) cats.push({key:'mod',label:'<i class="fas fa-shield-halved"></i> Moderating',items:modGroups});
    if(joinedGroups.length) cats.push({key:'joined',label:'<i class="fas fa-users"></i> Joined',items:joinedGroups});
    cats.push({key:'discover',label:'<i class="fas fa-compass"></i> Discover',items:recommended});
    return cats;
}
function renderGroups(filter){
    var cats=getGroupCategories(filter);
    if(!currentGroupTab||!cats.find(function(c){return c.key===currentGroupTab;})) currentGroupTab=cats[0].key;
    var tabsHtml='';
    cats.forEach(function(c){tabsHtml+='<button class="search-tab'+(c.key===currentGroupTab?' active':'')+'" data-gtab="'+c.key+'">'+c.label+'</button>';});
    $('#groupsTabs').innerHTML=tabsHtml;
    var active=cats.find(function(c){return c.key===currentGroupTab;});
    var html='';
    if(active.items.length){html+='<div class="shop-scroll-row scroll-2row">';active.items.forEach(function(g){html+=groupCardHtml(g);});html+='</div>';}
    else{html+='<p style="color:var(--gray);font-size:14px;padding:20px 0;text-align:center;">No groups here'+(filter?' matching "'+filter+'"':'')+'.</p>';}
    $('#groupsSections').innerHTML=html;
    bindGroupEvents('#groupsSections');
    initDragScroll('#groupsSections');
    $$('#groupsTabs .search-tab').forEach(function(tab){tab.addEventListener('click',function(){
        $$('#groupsTabs .search-tab').forEach(function(t){t.classList.remove('active');});
        tab.classList.add('active');currentGroupTab=tab.dataset.gtab;$('#groupSearch').value='';renderGroups();
    });});
}
function bindGroupEvents(container){
    $$(container+' .join-group-btn').forEach(function(btn){
        btn.addEventListener('click',function(e){
            e.stopPropagation();
            var gid=parseInt(btn.getAttribute('data-gid'));
            if(!state.joinedGroups[gid]){
                state.joinedGroups[gid]=true;
                var jg=groups.find(function(g){return g.id===gid;});
                if(jg)jg.members++;
                addNotification('group','You joined "'+jg.name+'"');
                renderGroups();
            }
        });
    });
    $$(container+' .view-group-btn').forEach(function(btn){
        btn.addEventListener('click',function(e){
            e.stopPropagation();
            var gid=parseInt(btn.getAttribute('data-gid'));
            var group=groups.find(function(g){return g.id===gid;});
            if(group) showGroupView(group);
        });
    });
    $$(container+' .group-card').forEach(function(card){
        card.addEventListener('click',function(){
            var gid=parseInt(card.getAttribute('data-gid'));
            var group=groups.find(function(g){return g.id===gid;});
            if(group) showGroupView(group);
        });
    });
}
$('#groupSearch').addEventListener('input',function(){renderGroups(this.value);});
$('#createGroupBtn').addEventListener('click',function(){
    showModal('<div class="modal-header"><h3>Create Group</h3><button class="modal-close"><i class="fas fa-times"></i></button></div><div class="modal-body"><div style="margin-bottom:14px;"><label style="font-size:13px;font-weight:600;display:block;margin-bottom:6px;">Group Name</label><input type="text" class="post-input" id="newGroupName" placeholder="Enter group name" style="width:100%;"></div><div style="margin-bottom:14px;"><label style="font-size:13px;font-weight:600;display:block;margin-bottom:6px;">Description</label><input type="text" class="post-input" id="newGroupDesc" placeholder="What is this group about?" style="width:100%;"></div><button class="btn btn-primary btn-block" id="submitGroupBtn">Create Group</button></div>');
    document.getElementById('submitGroupBtn').addEventListener('click',function(){
        var name=document.getElementById('newGroupName').value.trim();
        var desc=document.getElementById('newGroupDesc').value.trim();
        if(!name){return;}
        var newGroup={id:groups.length+1,name:name,desc:desc||'A new group on DabbleHQ',icon:'fa-users',members:1,color:'#'+Math.floor(Math.random()*16777215).toString(16).padStart(6,'0'),createdBy:'me',mods:[]};
        groups.push(newGroup);
        state.joinedGroups[newGroup.id]=true;
        closeModal();
        renderGroups();
        addNotification('group','You created the group "'+name+'"');
    });
});

// ======================== PROFILES PAGE ========================
var currentProfileTab='network';
function profileCardHtml(p,showRel){
    var followed=state.followedUsers[p.id];
    var relHtml='';
    if(showRel){
        var theyFollowMe=myFollowers.indexOf(p.id)!==-1;
        var rel=followed&&theyFollowMe?'Mutual':theyFollowMe?'Follows You':'Not Following You';
        relHtml='<span style="font-size:11px;color:var(--gray);font-style:italic;display:block;margin-top:2px;">'+rel+'</span>';
    }
    return '<div class="profile-card-item"><img src="https://i.pravatar.cc/64?img='+p.img+'" alt="'+p.name+'"><h4 data-person-id="'+p.id+'">'+p.name+'</h4><p>'+p.bio+'</p>'+relHtml+'<div style="display:flex;gap:8px;margin-top:8px;"><button class="btn '+(followed?'btn-disabled':'btn-green')+' profile-follow-btn" data-uid="'+p.id+'" style="flex:1;">'+(followed?'<i class="fas fa-check"></i> Following':'<i class="fas fa-plus"></i> Follow')+'</button><button class="btn btn-outline profile-view-btn" data-uid="'+p.id+'" style="flex:1;"><i class="fas fa-user"></i> View</button></div></div>';
}
function renderMyNetwork(){
    var html='';
    var followingList=people.filter(function(p){return state.followedUsers[p.id];});
    var followerList=myFollowers.map(function(id){return people.find(function(p){return p.id===id;});}).filter(Boolean);
    html+='<div class="shop-section-title"><i class="fas fa-user-check"></i> Following <span style="font-size:12px;color:var(--gray);font-weight:400;">('+followingList.length+')</span></div>';
    if(followingList.length){html+='<div class="shop-scroll-row">';followingList.forEach(function(p){html+=profileCardHtml(p,true);});html+='</div>';}
    else{html+='<p style="text-align:center;color:var(--gray);padding:20px 0;">You\'re not following anyone yet.</p>';}
    html+='<div class="shop-section-title"><i class="fas fa-users"></i> Followers <span style="font-size:12px;color:var(--gray);font-weight:400;">('+followerList.length+')</span></div>';
    if(followerList.length){html+='<div class="shop-scroll-row">';followerList.forEach(function(p){html+=profileCardHtml(p,true);});html+='</div>';}
    else{html+='<p style="text-align:center;color:var(--gray);padding:20px 0;">No followers yet.</p>';}
    $('#profilesSections').innerHTML=html;
    bindProfileEvents('#profilesSections');
    initDragScroll('#profilesSections');
}
function renderDiscover(filter){
    var html='';
    var list=people;
    if(filter){
        list=people.filter(function(p){return !blockedUsers[p.id]&&(p.name.toLowerCase().indexOf(filter.toLowerCase())!==-1||p.bio.toLowerCase().indexOf(filter.toLowerCase())!==-1);});
        if(!list.length){html='<div class="empty-state"><i class="fas fa-search"></i><p>No people found matching "'+filter+'"</p></div>';}
        else{html+='<div class="shop-section-title"><i class="fas fa-search"></i> Results for "'+filter+'"</div><div class="shop-scroll-row">';list.forEach(function(p){html+=profileCardHtml(p);});html+='</div>';}
    } else {
        var recs=getFriendsOfFollowed();
        if(recs.length){
            html+='<div class="shop-section-title"><i class="fas fa-user-plus"></i> Recommended For You</div><div class="shop-scroll-row">';
            recs.forEach(function(p){html+=profileCardHtml(p);});
            html+='</div>';
        }
        html+='<div class="shop-section-title"><i class="fas fa-users"></i> Discover People</div><div class="shop-scroll-row scroll-2row">';
        people.filter(function(p){return !blockedUsers[p.id];}).slice(0,20).forEach(function(p){html+=profileCardHtml(p);});
        html+='</div>';
    }
    $('#profilesSections').innerHTML=html;
    bindProfileEvents('#profilesSections');
    initDragScroll('#profilesSections');
}
function renderProfiles(filter){
    if(filter||currentProfileTab==='discover') renderDiscover(filter);
    else renderMyNetwork();
}
function bindProfileEvents(c){
    $$(c+' .profile-follow-btn').forEach(function(btn){btn.addEventListener('click',function(){toggleFollow(parseInt(btn.dataset.uid),btn);});});
    $$(c+' .profile-view-btn').forEach(function(btn){btn.addEventListener('click',function(){var p=people.find(function(x){return x.id===parseInt(btn.dataset.uid);});if(p)showProfileView(p);});});
    $$(c+' .profile-card-item h4').forEach(function(el){el.addEventListener('click',function(){var p=people.find(function(x){return x.id===parseInt(el.dataset.personId);});if(p)showProfileModal(p);});});
}
$$('#profilesTabs .search-tab').forEach(function(tab){
    tab.addEventListener('click',function(){
        $$('#profilesTabs .search-tab').forEach(function(t){t.classList.remove('active');});
        tab.classList.add('active');
        currentProfileTab=tab.dataset.ptab;
        $('#profileSearch').value='';
        renderProfiles();
    });
});
$('#profileSearch').addEventListener('input',function(){renderProfiles(this.value);});

// ======================== SKIN SHOP ========================
function shopCard(preview,body){return '<div class="skin-card"><div class="skin-preview" style="background:'+preview+';">'+body+'</div>';}
function shopBuy(owned,price,cls,attr){
    if(owned) return '<button class="btn btn-disabled">Owned</button>';
    return '<div class="skin-price"><i class="fas fa-coins"></i> '+price+' Coins</div><button class="btn '+(state.coins>=price?'btn-primary':'btn-disabled')+' '+cls+'" '+attr+(state.coins<price?' disabled':'')+'>Buy</button>';
}
var currentShopTab=null;
function getShopCategories(){
    var cats=[];
    cats.push({key:'basic',label:'<i class="fas fa-palette"></i> Basic Skins',items:skins,render:function(s){return '<div class="skin-card"><div class="skin-preview" style="background:'+s.preview+';"><div class="skin-preview-inner" style="color:#333;background:#fff;">Profile Preview</div></div><div class="skin-card-body" style="background:'+s.cardBg+';"><h4 style="color:'+s.cardText+';">'+s.name+'</h4><p style="color:'+s.cardMuted+';">'+s.desc+'</p>'+shopBuy(state.ownedSkins[s.id],s.price,'buy-skin-btn','data-sid="'+s.id+'"')+'</div></div>';}});
    cats.push({key:'premium',label:'<i class="fas fa-gem"></i> Premium Skins',items:premiumSkins,render:function(s){return '<div class="skin-card"><div class="skin-preview" style="background:'+s.preview+';"><div class="premium-preview-frame" style="background:'+s.border+';"><img src="https://i.pravatar.cc/60?img=12" class="premium-preview-avatar"></div></div><div class="skin-card-body"><h4><i class="fas '+s.icon+'" style="color:'+s.iconColor+';margin-right:6px;"></i>'+s.name+'</h4><p>'+s.desc+'</p>'+shopBuy(state.ownedPremiumSkins[s.id],s.price,'buy-premium-btn','data-pid="'+s.id+'"')+'</div></div>';}});
    cats.push({key:'fonts',label:'<i class="fas fa-font"></i> Font Styles',items:fonts,render:function(f){return '<div class="skin-card"><div class="skin-preview" style="background:linear-gradient(135deg,#667eea,#764ba2);"><span style="font-family:\''+f.family+'\',sans-serif;color:#fff;font-size:24px;">Aa Bb Cc</span></div><div class="skin-card-body"><h4 style="font-family:\''+f.family+'\',sans-serif;">'+f.name+'</h4><p>'+f.desc+'</p>'+shopBuy(state.ownedFonts[f.id],f.price,'buy-font-btn','data-fid="'+f.id+'"')+'</div></div>';}});
    cats.push({key:'logos',label:'<i class="fas fa-star"></i> Logo Styles',items:logos,render:function(l){return '<div class="skin-card"><div class="skin-preview" style="background:linear-gradient(135deg,#f093fb,#f5576c);"><span style="color:#fff;font-size:22px;font-weight:700;">'+l.text+'</span></div><div class="skin-card-body"><h4>'+l.name+'</h4><p>'+l.desc+'</p>'+shopBuy(state.ownedLogos[l.id],l.price,'buy-logo-btn','data-lid="'+l.id+'"')+'</div></div>';}});
    cats.push({key:'icons',label:'<i class="fas fa-icons"></i> Icon Sets',items:iconSets,render:function(s){var prev='';Object.keys(s.icons).slice(0,5).forEach(function(k){prev+='<i class="fas '+s.icons[k]+'" style="margin:0 4px;font-size:18px;"></i>';});return '<div class="skin-card"><div class="skin-preview" style="background:'+s.preview+';"><div style="color:#fff;">'+prev+'</div></div><div class="skin-card-body"><h4>'+s.name+'</h4><p>'+s.desc+'</p>'+shopBuy(state.ownedIconSets[s.id],s.price,'buy-icon-btn','data-iid="'+s.id+'"')+'</div></div>';}});
    cats.push({key:'coins',label:'<i class="fas fa-coins"></i> Coin Skins',items:coinSkins,render:function(s){return '<div class="skin-card"><div class="skin-preview" style="background:linear-gradient(135deg,#1a1a2e,#16213e);"><i class="fas '+s.icon+'" style="font-size:36px;color:'+s.color+';"></i></div><div class="skin-card-body"><h4>'+s.name+'</h4><p>'+s.desc+'</p>'+shopBuy(state.ownedCoinSkins[s.id],s.price,'buy-coin-btn','data-cid="'+s.id+'"')+'</div></div>';}});
    cats.push({key:'templates',label:'<i class="fas fa-table-columns"></i> Templates',items:templates,render:function(t){return '<div class="skin-card"><div class="skin-preview" style="background:'+t.preview+';"><i class="fas fa-table-columns" style="font-size:36px;color:rgba(255,255,255,.9);"></i></div><div class="skin-card-body"><h4>'+t.name+'</h4><p>'+t.desc+'</p>'+shopBuy(state.ownedTemplates[t.id],t.price,'buy-tpl-btn','data-tid="'+t.id+'"')+'</div></div>';}});
    cats.push({key:'navstyles',label:'<i class="fas fa-bars-staggered"></i> Nav Styles',items:navStyles,render:function(n){return '<div class="skin-card"><div class="skin-preview" style="background:'+n.preview+';"><i class="fas fa-bars-staggered" style="font-size:36px;color:rgba(255,255,255,.9);"></i></div><div class="skin-card-body"><h4>'+n.name+'</h4><p>'+n.desc+'</p>'+shopBuy(state.ownedNavStyles[n.id],n.price,'buy-nav-btn','data-nid="'+n.id+'"')+'</div></div>';}});
    return cats;
}
function renderShop(){
    var cats=getShopCategories();
    if(!currentShopTab) currentShopTab=cats[0].key;
    var tabsHtml='';
    cats.forEach(function(c){tabsHtml+='<button class="search-tab'+(c.key===currentShopTab?' active':'')+'" data-stab="'+c.key+'">'+c.label+'</button>';});
    $('#shopTabs').innerHTML=tabsHtml;
    var active=cats.find(function(c){return c.key===currentShopTab;});
    var html='<div class="shop-scroll-row scroll-2row">';
    active.items.forEach(function(item){html+=active.render(item);});
    html+='</div>';
    $('#shopGrid').innerHTML=html;
    function shopPurchased(btn){var p=btn.parentElement;var priceEl=p.querySelector('.skin-price');if(priceEl)priceEl.remove();btn.className='btn btn-disabled';btn.textContent='Owned';btn.disabled=true;btn.replaceWith(btn.cloneNode(true));renderMySkins();}
    $$('.buy-skin-btn').forEach(function(btn){btn.addEventListener('click',function(){var sid=btn.getAttribute('data-sid');var skin=skins.find(function(s){return s.id===sid;});if(state.coins>=skin.price){state.coins-=skin.price;state.ownedSkins[sid]=true;updateCoins();shopPurchased(btn);addNotification('skin','You purchased the "'+skin.name+'" skin!');}});});
    $$('.buy-font-btn').forEach(function(btn){btn.addEventListener('click',function(){var fid=btn.getAttribute('data-fid');var font=fonts.find(function(f){return f.id===fid;});if(state.coins>=font.price){state.coins-=font.price;state.ownedFonts[fid]=true;updateCoins();shopPurchased(btn);addNotification('skin','You purchased the "'+font.name+'" font!');}});});
    $$('.buy-logo-btn').forEach(function(btn){btn.addEventListener('click',function(){var lid=btn.getAttribute('data-lid');var logo=logos.find(function(l){return l.id===lid;});if(state.coins>=logo.price){state.coins-=logo.price;state.ownedLogos[lid]=true;updateCoins();shopPurchased(btn);addNotification('skin','You purchased the "'+logo.name+'" logo!');}});});
    $$('.buy-icon-btn').forEach(function(btn){btn.addEventListener('click',function(){var iid=btn.getAttribute('data-iid');var s=iconSets.find(function(x){return x.id===iid;});if(state.coins>=s.price){state.coins-=s.price;state.ownedIconSets[iid]=true;updateCoins();shopPurchased(btn);addNotification('skin','You purchased the "'+s.name+'" icon set!');}});});
    $$('.buy-coin-btn').forEach(function(btn){btn.addEventListener('click',function(){var cid=btn.getAttribute('data-cid');var s=coinSkins.find(function(x){return x.id===cid;});if(state.coins>=s.price){state.coins-=s.price;state.ownedCoinSkins[cid]=true;updateCoins();shopPurchased(btn);addNotification('skin','You purchased the "'+s.name+'" coin skin!');}});});
    $$('.buy-tpl-btn').forEach(function(btn){btn.addEventListener('click',function(){var tid=btn.getAttribute('data-tid');var t=templates.find(function(x){return x.id===tid;});if(state.coins>=t.price){state.coins-=t.price;state.ownedTemplates[tid]=true;updateCoins();shopPurchased(btn);addNotification('skin','You purchased the "'+t.name+'" template!');}});});
    $$('.buy-premium-btn').forEach(function(btn){btn.addEventListener('click',function(){var pid=btn.getAttribute('data-pid');var skin=premiumSkins.find(function(s){return s.id===pid;});if(state.coins>=skin.price){state.coins-=skin.price;state.ownedPremiumSkins[pid]=true;updateCoins();shopPurchased(btn);addNotification('skin','You purchased the "'+skin.name+'" premium skin!');}});});
    $$('.buy-nav-btn').forEach(function(btn){btn.addEventListener('click',function(){var nid=btn.getAttribute('data-nid');var n=navStyles.find(function(x){return x.id===nid;});if(state.coins>=n.price){state.coins-=n.price;state.ownedNavStyles[nid]=true;updateCoins();shopPurchased(btn);addNotification('skin','You purchased the "'+n.name+'" nav style!');}});});
    initDragScroll('#shopGrid');
    $$('#shopTabs .search-tab').forEach(function(tab){tab.addEventListener('click',function(){
        $$('#shopTabs .search-tab').forEach(function(t){t.classList.remove('active');});
        tab.classList.add('active');currentShopTab=tab.dataset.stab;renderShop();
    });});
}

var skinColors={
    classic:{primary:'#5cbdb9',hover:'#4aada9',navBg:'#5cbdb9',light:true},
    midnight:{primary:'#e94560',hover:'#c73a52',navBg:'#16213e'},
    ocean:{primary:'#1976d2',hover:'#1565c0',navBg:'#1565c0',light:true},
    forest:{primary:'#2e7d32',hover:'#1b5e20',navBg:'#2e7d32',light:true},
    royal:{primary:'#7b1fa2',hover:'#6a1b9a',navBg:'#6a1b9a',light:true},
    sunset:{primary:'#ef6c00',hover:'#e65100',navBg:'#e65100',light:true},
    cherry:{primary:'#d81b60',hover:'#c2185b',navBg:'#c2185b',light:true},
    slate:{primary:'#78909c',hover:'#607d8b',navBg:'#37474f'},
    ember:{primary:'#e64a19',hover:'#bf360c',navBg:'#bf360c',light:true},
    arctic:{primary:'#00acc1',hover:'#00838f',navBg:'#00838f',light:true},
    moss:{primary:'#689f38',hover:'#558b2f',navBg:'#558b2f',light:true}
};

function setThemeVars(light){
    var root=document.documentElement;
    if(light){
        root.style.setProperty('--dark','#333');root.style.setProperty('--gray','#777');root.style.setProperty('--light-bg','#f0f0f0');
        root.style.setProperty('--card','#fff');root.style.setProperty('--border','#e8e8e8');
        root.style.setProperty('--shadow','0 2px 8px rgba(0,0,0,.08)');root.style.setProperty('--shadow-hover','0 4px 16px rgba(0,0,0,.12)');
        document.body.style.backgroundImage='none';
    } else {
        root.style.setProperty('--dark','#e2e8f0');root.style.setProperty('--gray','#94a3b8');root.style.setProperty('--light-bg','#0f172a');
        root.style.setProperty('--card','#1e293b');root.style.setProperty('--border','#334155');
        root.style.setProperty('--shadow','0 2px 8px rgba(0,0,0,.25)');root.style.setProperty('--shadow-hover','0 4px 16px rgba(0,0,0,.35)');
        document.body.style.backgroundImage='';
    }
}
function applySkin(skinId,silent){
    var card=$('#profileCard');
    var root=document.documentElement;
    skins.forEach(function(s){card.classList.remove('skin-'+s.id);document.body.classList.remove('skin-'+s.id);});
    premiumSkins.forEach(function(s){document.body.classList.remove('premium-'+s.id);});
    document.body.classList.remove('premium-dark');
    var avatars=document.querySelectorAll('#profileAvatarImg, .pv-profile-card .profile-avatar, .nav-avatar');
    avatars.forEach(function(av){av.classList.remove('premium-border');av.removeAttribute('data-premium');});
    state.activePremiumSkin=null;
    if(skinId&&skinId!=='default'){
        card.classList.add('skin-'+skinId);
        document.body.classList.add('skin-'+skinId);
        if(!silent) state.activeSkin=skinId;
        var colors=skinColors[skinId];
        if(colors){
            root.style.setProperty('--primary',colors.primary);
            root.style.setProperty('--primary-hover',colors.hover);
            root.style.setProperty('--nav-bg',colors.navBg||colors.primary);
            setThemeVars(!!colors.light);
        }
        if(!silent){var skin=skins.find(function(s){return s.id===skinId;});addNotification('skin','You applied the "'+skin.name+'" skin!');}
    } else {
        if(!silent) state.activeSkin=null;
        root.style.setProperty('--primary','#8b5cf6');
        root.style.setProperty('--primary-hover','#7c3aed');
        root.style.setProperty('--nav-bg','#0f172a');
        setThemeVars(false);
    }
}

function applyFont(fontId,silent){
    if(fontId){var f=fonts.find(function(x){return x.id===fontId;});document.body.style.fontFamily="'"+f.family+"',sans-serif";if(!silent)state.activeFont=fontId;}
    else{document.body.style.fontFamily="'Roboto',sans-serif";if(!silent)state.activeFont=null;}
}

function applyLogo(logoId){
    if(logoId){var l=logos.find(function(x){return x.id===logoId;});$('.nav-logo').textContent=l.text;state.activeLogo=logoId;}
    else{$('.nav-logo').textContent='DabbleHQ';state.activeLogo=null;}
}

function applyIconSet(setId){
    var prev=JSON.parse(JSON.stringify(activeIcons));
    var icons=setId?iconSets.find(function(s){return s.id===setId;}).icons:defaultIcons;
    var newMap={};
    Object.keys(defaultIcons).forEach(function(k){newMap[k]=icons[k]||defaultIcons[k];});
    Object.keys(newMap).forEach(function(k){
        if(prev[k]!==newMap[k]){
            document.querySelectorAll('i.'+prev[k]).forEach(function(el){el.classList.remove(prev[k]);el.classList.add(newMap[k]);});
        }
    });
    // Update nav icons specifically (they use data-page)
    ['home','groups','skins','profiles','shop','messages','notifications'].forEach(function(page){var el=document.querySelector('.nav-link[data-page="'+page+'"] i');if(el){el.className='fas '+newMap[page];}});
    activeIcons=newMap;
    state.activeIconSet=setId;
    if(setId)addNotification('skin','You applied the "'+iconSets.find(function(s){return s.id===setId;}).name+'" icon set!');
}

function applyCoinSkin(skinId){
    var icon=skinId?coinSkins.find(function(s){return s.id===skinId;}).icon:'fa-coins';
    var color=skinId?coinSkins.find(function(s){return s.id===skinId;}).color:'#ffd700';
    $$('.nav-coins i, .profile-coins i').forEach(function(el){el.className='fas '+icon;});
    document.querySelector('.nav-coins').style.color=color;
    state.activeCoinSkin=skinId;
    if(skinId)addNotification('skin','You applied the "'+coinSkins.find(function(s){return s.id===skinId;}).name+'" coin skin!');
}

function applyTemplate(tplId,silent){
    templates.forEach(function(t){document.body.classList.remove('tpl-'+t.id);});
    if(tplId){document.body.classList.add('tpl-'+tplId);if(!silent){state.activeTemplate=tplId;addNotification('skin','You applied the "'+templates.find(function(t){return t.id===tplId;}).name+'" template!');}}
    else{if(!silent)state.activeTemplate=null;}
}

function applyNavStyle(nsId){
    navStyles.forEach(function(n){document.body.classList.remove('nav-'+n.id);});
    if(nsId){document.body.classList.add('nav-'+nsId);state.activeNavStyle=nsId;addNotification('skin','You applied the "'+navStyles.find(function(n){return n.id===nsId;}).name+'" nav style!');}
    else{state.activeNavStyle=null;}
}

function applyPremiumSkin(skinId,silent){
    var root=document.documentElement;var card=$('#profileCard');
    // Clear all premium classes
    premiumSkins.forEach(function(s){document.body.classList.remove('premium-'+s.id);});
    document.body.classList.remove('premium-dark');
    var avatars=document.querySelectorAll('#profileAvatarImg, .pv-profile-card .profile-avatar, .nav-avatar');
    avatars.forEach(function(av){av.classList.remove('premium-border');av.removeAttribute('data-premium');});
    if(skinId&&skinId!=='default'){
        // Clear basic skin first
        skins.forEach(function(s){card.classList.remove('skin-'+s.id);document.body.classList.remove('skin-'+s.id);});
        state.activeSkin=null;
        // Apply premium
        var skin=premiumSkins.find(function(s){return s.id===skinId;});
        document.body.classList.add('premium-'+skinId);
        if(skin.dark) document.body.classList.add('premium-dark');
        root.style.setProperty('--primary',skin.accent);
        root.style.setProperty('--primary-hover',skin.accentHover);
        root.style.setProperty('--nav-bg',skin.accent);
        avatars.forEach(function(av){av.classList.add('premium-border');av.setAttribute('data-premium',skinId);});
        if(!silent){state.activePremiumSkin=skinId;addNotification('skin','You applied the "'+skin.name+'" premium skin!');}
    } else {
        if(!silent) state.activePremiumSkin=null;
        applySkin(state.activeSkin,true);
    }
}

var currentMySkinsTab=null;
function getMySkinCategories(){
    var cats=[];
    var ownedS=skins.filter(function(s){return state.ownedSkins[s.id];});
    var ownedP=premiumSkins.filter(function(s){return state.ownedPremiumSkins[s.id];});
    var ownedF=fonts.filter(function(f){return state.ownedFonts[f.id];});
    var ownedL=logos.filter(function(l){return state.ownedLogos[l.id];});
    var ownedI=iconSets.filter(function(s){return state.ownedIconSets[s.id];});
    var ownedC=coinSkins.filter(function(s){return state.ownedCoinSkins[s.id];});
    var ownedT=templates.filter(function(t){return state.ownedTemplates[t.id];});
    if(ownedS.length) cats.push({key:'basic',label:'<i class="fas fa-palette"></i> Basic Skins',items:ownedS,render:function(s){var a=state.activeSkin===s.id;return '<div class="skin-card"><div class="skin-preview" style="background:'+s.preview+';"><div class="skin-preview-inner" style="color:#333;background:#fff;">Preview</div></div><div class="skin-card-body" style="background:'+s.cardBg+';"><h4 style="color:'+s.cardText+';">'+s.name+'</h4><p style="color:'+s.cardMuted+';">'+s.desc+'</p><button class="btn '+(a?'btn-disabled':'btn-primary')+' apply-skin-btn" data-sid="'+s.id+'">'+(a?'Active':'Apply')+'</button></div></div>';},defaultCard:'<div class="skin-card"><div class="skin-preview" style="background:linear-gradient(135deg,#8b5cf6,#7c3aed);"><div class="skin-preview-inner" style="color:#333;background:#fff;">Default</div></div><div class="skin-card-body"><h4>Default</h4><p>The DabbleHQ signature look.</p><button class="btn '+(!state.activeSkin?'btn-disabled':'btn-primary')+' apply-skin-btn" data-sid="default">'+(!state.activeSkin?'Active':'Apply')+'</button></div></div>'});
    if(ownedP.length) cats.push({key:'premium',label:'<i class="fas fa-gem"></i> Premium Skins',items:ownedP,render:function(s){var a=state.activePremiumSkin===s.id;return '<div class="skin-card"><div class="skin-preview" style="background:'+s.preview+';"><div class="premium-preview-frame" style="background:'+s.border+';"><img src="https://i.pravatar.cc/60?img=12" class="premium-preview-avatar"></div></div><div class="skin-card-body"><h4><i class="fas '+s.icon+'" style="color:'+s.iconColor+';margin-right:6px;"></i>'+s.name+'</h4><p>'+s.desc+'</p><button class="btn '+(a?'btn-disabled':'btn-primary')+' apply-premium-btn" data-pid="'+s.id+'">'+(a?'Active':'Apply')+'</button></div></div>';},defaultCard:'<div class="skin-card"><div class="skin-preview" style="background:linear-gradient(135deg,#8b5cf6,#7c3aed);"><div style="color:#fff;font-size:14px;font-weight:600;">Default</div></div><div class="skin-card-body"><h4>Default</h4><p>The DabbleHQ signature look.</p><button class="btn '+(!state.activePremiumSkin?'btn-disabled':'btn-primary')+' apply-premium-btn" data-pid="default">'+(!state.activePremiumSkin?'Active':'Apply')+'</button></div></div>'});
    if(ownedF.length) cats.push({key:'fonts',label:'<i class="fas fa-font"></i> Font Styles',items:ownedF,render:function(f){var a=state.activeFont===f.id;return '<div class="skin-card"><div class="skin-preview" style="background:linear-gradient(135deg,#667eea,#764ba2);"><span style="font-family:\''+f.family+'\',sans-serif;color:#fff;font-size:24px;">Aa Bb Cc</span></div><div class="skin-card-body"><h4 style="font-family:\''+f.family+'\',sans-serif;">'+f.name+'</h4><p>'+f.desc+'</p><button class="btn '+(a?'btn-disabled':'btn-primary')+' apply-font-btn" data-fid="'+f.id+'">'+(a?'Active':'Apply')+'</button></div></div>';},defaultCard:'<div class="skin-card"><div class="skin-preview" style="background:linear-gradient(135deg,#667eea,#764ba2);"><span style="font-family:Roboto,sans-serif;color:#fff;font-size:24px;">Aa Bb Cc</span></div><div class="skin-card-body"><h4>Default (Roboto)</h4><p>The original DabbleHQ font.</p><button class="btn '+(!state.activeFont?'btn-disabled':'btn-primary')+' apply-font-btn" data-fid="default">'+(!state.activeFont?'Active':'Apply')+'</button></div></div>'});
    if(ownedL.length) cats.push({key:'logos',label:'<i class="fas fa-star"></i> Logo Styles',items:ownedL,render:function(l){var a=state.activeLogo===l.id;return '<div class="skin-card"><div class="skin-preview" style="background:linear-gradient(135deg,#f093fb,#f5576c);"><span style="color:#fff;font-size:22px;font-weight:700;">'+l.text+'</span></div><div class="skin-card-body"><h4>'+l.name+'</h4><p>'+l.desc+'</p><button class="btn '+(a?'btn-disabled':'btn-primary')+' apply-logo-btn" data-lid="'+l.id+'">'+(a?'Active':'Apply')+'</button></div></div>';},defaultCard:'<div class="skin-card"><div class="skin-preview" style="background:linear-gradient(135deg,#f093fb,#f5576c);"><span style="color:#fff;font-size:22px;font-weight:700;">DabbleHQ</span></div><div class="skin-card-body"><h4>Default</h4><p>The original DabbleHQ logo.</p><button class="btn '+(!state.activeLogo?'btn-disabled':'btn-primary')+' apply-logo-btn" data-lid="default">'+(!state.activeLogo?'Active':'Apply')+'</button></div></div>'});
    if(ownedI.length) cats.push({key:'icons',label:'<i class="fas fa-icons"></i> Icon Sets',items:ownedI,render:function(s){var a=state.activeIconSet===s.id;var prev='';Object.keys(s.icons).slice(0,4).forEach(function(k){prev+='<i class="fas '+s.icons[k]+'" style="margin:0 4px;font-size:18px;"></i>';});return '<div class="skin-card"><div class="skin-preview" style="background:'+s.preview+';"><div style="color:#fff;">'+prev+'</div></div><div class="skin-card-body"><h4>'+s.name+'</h4><p>'+s.desc+'</p><button class="btn '+(a?'btn-disabled':'btn-primary')+' apply-icon-btn" data-iid="'+s.id+'">'+(a?'Active':'Apply')+'</button></div></div>';},defaultCard:'<div class="skin-card"><div class="skin-preview" style="background:linear-gradient(135deg,#8b5cf6,#7c3aed);"><div style="color:#fff;"><i class="fas fa-home" style="margin:0 4px;font-size:18px;"></i><i class="fas fa-users-rectangle" style="margin:0 4px;font-size:18px;"></i><i class="fas fa-palette" style="margin:0 4px;font-size:18px;"></i><i class="fas fa-store" style="margin:0 4px;font-size:18px;"></i></div></div><div class="skin-card-body"><h4>Default</h4><p>The original DabbleHQ icons.</p><button class="btn '+(!state.activeIconSet?'btn-disabled':'btn-primary')+' apply-icon-btn" data-iid="default">'+(!state.activeIconSet?'Active':'Apply')+'</button></div></div>'});
    if(ownedC.length) cats.push({key:'coins',label:'<i class="fas fa-coins"></i> Coin Skins',items:ownedC,render:function(s){var a=state.activeCoinSkin===s.id;return '<div class="skin-card"><div class="skin-preview" style="background:linear-gradient(135deg,#1a1a2e,#16213e);"><i class="fas '+s.icon+'" style="font-size:36px;color:'+s.color+';"></i></div><div class="skin-card-body"><h4>'+s.name+'</h4><p>'+s.desc+'</p><button class="btn '+(a?'btn-disabled':'btn-primary')+' apply-coin-btn" data-cid="'+s.id+'">'+(a?'Active':'Apply')+'</button></div></div>';},defaultCard:'<div class="skin-card"><div class="skin-preview" style="background:linear-gradient(135deg,#1a1a2e,#16213e);"><i class="fas fa-coins" style="font-size:36px;color:#ffd700;"></i></div><div class="skin-card-body"><h4>Default</h4><p>The original gold coins.</p><button class="btn '+(!state.activeCoinSkin?'btn-disabled':'btn-primary')+' apply-coin-btn" data-cid="default">'+(!state.activeCoinSkin?'Active':'Apply')+'</button></div></div>'});
    if(ownedT.length) cats.push({key:'templates',label:'<i class="fas fa-table-columns"></i> Templates',items:ownedT,render:function(t){var a=state.activeTemplate===t.id;return '<div class="skin-card"><div class="skin-preview" style="background:'+t.preview+';"><i class="fas fa-table-columns" style="font-size:36px;color:rgba(255,255,255,.9);"></i></div><div class="skin-card-body"><h4>'+t.name+'</h4><p>'+t.desc+'</p><button class="btn '+(a?'btn-disabled':'btn-primary')+' apply-tpl-btn" data-tid="'+t.id+'">'+(a?'Active':'Apply')+'</button></div></div>';},defaultCard:'<div class="skin-card"><div class="skin-preview" style="background:linear-gradient(135deg,#8b5cf6,#7c3aed);"><i class="fas fa-table-columns" style="font-size:36px;color:rgba(255,255,255,.9);"></i></div><div class="skin-card-body"><h4>Default Template</h4><p>Wide feed, narrow sidebars.</p><button class="btn '+(state.activeTemplate==='spotlight'?'btn-disabled':'btn-primary')+' apply-tpl-btn" data-tid="spotlight">'+(state.activeTemplate==='spotlight'?'Active':'Apply')+'</button></div></div>'});
    var ownedN=navStyles.filter(function(n){return state.ownedNavStyles[n.id];});
    if(ownedN.length) cats.push({key:'navstyles',label:'<i class="fas fa-bars-staggered"></i> Nav Styles',items:ownedN,render:function(n){var a=state.activeNavStyle===n.id;return '<div class="skin-card"><div class="skin-preview" style="background:'+n.preview+';"><i class="fas fa-bars-staggered" style="font-size:36px;color:rgba(255,255,255,.9);"></i></div><div class="skin-card-body"><h4>'+n.name+'</h4><p>'+n.desc+'</p><button class="btn '+(a?'btn-disabled':'btn-primary')+' apply-nav-btn" data-nid="'+n.id+'">'+(a?'Active':'Apply')+'</button></div></div>';},defaultCard:'<div class="skin-card"><div class="skin-preview" style="background:linear-gradient(135deg,#8b5cf6,#7c3aed);"><i class="fas fa-bars-staggered" style="font-size:36px;color:rgba(255,255,255,.9);"></i></div><div class="skin-card-body"><h4>Default</h4><p>The original top navigation bar.</p><button class="btn '+(!state.activeNavStyle?'btn-disabled':'btn-primary')+' apply-nav-btn" data-nid="default">'+(!state.activeNavStyle?'Active':'Apply')+'</button></div></div>'});
    return cats;
}
function renderMySkins(){
    var cats=getMySkinCategories();
    if(!cats.length){
        $('#mySkinsTabs').innerHTML='';
        $('#mySkinsGrid').innerHTML='<div class="empty-state"><i class="fas fa-palette"></i><p>You don\'t own anything yet.</p><button class="btn btn-primary" data-page="shop">Visit Shop</button></div>';
        return;
    }
    if(!currentMySkinsTab||!cats.find(function(c){return c.key===currentMySkinsTab;})) currentMySkinsTab=cats[0].key;
    var tabsHtml='';
    cats.forEach(function(c){tabsHtml+='<button class="search-tab'+(c.key===currentMySkinsTab?' active':'')+'" data-mtab="'+c.key+'">'+c.label+'</button>';});
    $('#mySkinsTabs').innerHTML=tabsHtml;
    var active=cats.find(function(c){return c.key===currentMySkinsTab;});
    var html='<div class="shop-scroll-row scroll-2row">';
    if(active.defaultCard) html+=active.defaultCard;
    active.items.forEach(function(item){html+=active.render(item);});
    html+='</div>';
    $('#mySkinsGrid').innerHTML=html;
    function mySkinsRerender(){var row=$('#mySkinsGrid .shop-scroll-row');var sl=row?row.scrollLeft:0;renderMySkins();var row2=$('#mySkinsGrid .shop-scroll-row');if(row2)row2.scrollLeft=sl;}
    $$('#mySkinsGrid .apply-skin-btn').forEach(function(btn){btn.addEventListener('click',function(){applySkin(btn.dataset.sid==='default'?null:btn.dataset.sid);mySkinsRerender();});});
    $$('#mySkinsGrid .apply-font-btn').forEach(function(btn){btn.addEventListener('click',function(){applyFont(btn.dataset.fid==='default'?null:btn.dataset.fid);mySkinsRerender();});});
    $$('#mySkinsGrid .apply-logo-btn').forEach(function(btn){btn.addEventListener('click',function(){applyLogo(btn.dataset.lid==='default'?null:btn.dataset.lid);mySkinsRerender();});});
    $$('#mySkinsGrid .apply-icon-btn').forEach(function(btn){btn.addEventListener('click',function(){applyIconSet(btn.dataset.iid==='default'?null:btn.dataset.iid);mySkinsRerender();});});
    $$('#mySkinsGrid .apply-coin-btn').forEach(function(btn){btn.addEventListener('click',function(){applyCoinSkin(btn.dataset.cid==='default'?null:btn.dataset.cid);mySkinsRerender();});});
    $$('#mySkinsGrid .apply-tpl-btn').forEach(function(btn){btn.addEventListener('click',function(){applyTemplate(btn.dataset.tid==='default'?null:btn.dataset.tid);mySkinsRerender();});});
    $$('#mySkinsGrid .apply-premium-btn').forEach(function(btn){btn.addEventListener('click',function(){applyPremiumSkin(btn.dataset.pid==='default'?null:btn.dataset.pid);mySkinsRerender();});});
    $$('#mySkinsGrid .apply-nav-btn').forEach(function(btn){btn.addEventListener('click',function(){applyNavStyle(btn.dataset.nid==='default'?null:btn.dataset.nid);mySkinsRerender();});});
    initDragScroll('#mySkinsGrid');
    $$('#mySkinsTabs .search-tab').forEach(function(tab){tab.addEventListener('click',function(){
        $$('#mySkinsTabs .search-tab').forEach(function(t){t.classList.remove('active');});
        tab.classList.add('active');currentMySkinsTab=tab.dataset.mtab;renderMySkins();
    });});
}

// ======================== MESSAGES ========================
var activeChat=null;

function renderMsgContacts(filter){
    var filtered=msgContacts;
    if(filter){filtered=msgContacts.filter(function(c){return c.name.toLowerCase().indexOf(filter.toLowerCase())!==-1;});}
    var html='';
    filtered.forEach(function(c){
        var lastMsg=c.messages[c.messages.length-1];
        var preview=lastMsg?(lastMsg.from==='me'?'You: ':'')+lastMsg.text:'';
        html+='<div class="msg-contact'+(activeChat&&activeChat.id===c.id?' active':'')+'" data-cid="'+c.id+'">';
        html+='<img src="https://i.pravatar.cc/44?img='+c.img+'" alt="'+c.name+'">';
        html+='<div class="msg-contact-info"><div class="msg-contact-name">'+c.name+'</div><div class="msg-contact-preview">'+preview+'</div></div>';
        html+='<span class="msg-contact-time">now</span></div>';
    });
    $('#msgContactList').innerHTML=html;

    $$('.msg-contact').forEach(function(el){
        el.addEventListener('click',function(){
            var cid=parseInt(el.getAttribute('data-cid'));
            var contact=msgContacts.find(function(c){return c.id===cid;});
            if(contact) openChat(contact);
        });
    });
}

function openChat(contact){
    activeChat=contact;
    renderMsgContacts();
    var html='<div class="msg-chat-header"><img src="https://i.pravatar.cc/40?img='+contact.img+'" alt="'+contact.name+'"><h4>'+contact.name+'</h4></div>';
    html+='<div class="msg-chat-messages" id="chatMessages">';
    contact.messages.forEach(function(m){
        html+='<div class="msg-bubble '+(m.from==='me'?'sent':'received')+'">'+m.text+'</div>';
    });
    html+='</div>';
    html+='<div class="msg-chat-input"><input type="text" placeholder="Type a message..." id="msgInput"><button id="sendMsgBtn"><i class="fas fa-paper-plane"></i></button></div>';
    $('#msgChat').innerHTML=html;

    var msgArea=$('#chatMessages');
    msgArea.scrollTop=msgArea.scrollHeight;

    $('#sendMsgBtn').addEventListener('click',sendMessage);
    $('#msgInput').addEventListener('keypress',function(e){if(e.key==='Enter')sendMessage();});
}

function sendMessage(){
    var input=$('#msgInput');
    var text=input.value.trim();
    if(!text||!activeChat) return;
    activeChat.messages.push({from:'me',text:text});
    input.value='';
    var msgArea=$('#chatMessages');
    msgArea.insertAdjacentHTML('beforeend','<div class="msg-bubble sent">'+text+'</div>');
    msgArea.scrollTop=msgArea.scrollHeight;
    renderMsgContacts();

    // Auto reply after 1 second
    setTimeout(function(){
        var replies=['Sounds great!','Haha nice','That\'s awesome!','I totally agree','Tell me more!','LOL','For sure!','Interesting...','Love that!','Cool!'];
        var reply=replies[Math.floor(Math.random()*replies.length)];
        activeChat.messages.push({from:'them',text:reply});
        msgArea.insertAdjacentHTML('beforeend','<div class="msg-bubble received">'+reply+'</div>');
        msgArea.scrollTop=msgArea.scrollHeight;
        renderMsgContacts();
    },1000);
}

$('#msgSearch').addEventListener('input',function(){renderMsgContacts(this.value);});

// ======================== PHOTOS ========================
function getAllPhotos(){
    var all=state.photos.profile.concat(state.photos.cover,state.photos.post);
    state.photos.albums.forEach(function(a){all=all.concat(a.photos);});
    return all;
}
function renderPhotosCard(){
    var all=getAllPhotos();
    var el=$('#photosPreview');
    if(!all.length){el.innerHTML='<p class="photos-empty">No photos yet</p>';return;}
    var html='';
    all.slice(0,6).forEach(function(p){html+='<img src="'+p.src+'">';});
    el.innerHTML=html;
    el.querySelectorAll('img').forEach(function(img,i){img.addEventListener('click',function(){showPhotoLightbox(all[i].src);});});
}
function renderPhotoAlbum(){
    var html='<div style="display:flex;justify-content:flex-end;margin-bottom:16px;"><button class="btn btn-primary" id="createAlbumBtn"><i class="fas fa-plus"></i> Create Album</button></div>';
    // Profile Pictures
    html+='<div class="photo-album-section"><h3><i class="fas fa-user-circle"></i> Profile Pictures</h3>';
    if(state.photos.profile.length){html+='<div class="photo-album-grid">';state.photos.profile.forEach(function(p){html+='<img src="'+p.src+'">';});html+='</div>';}
    else html+='<p class="photo-album-empty">No profile pictures yet. Upload a profile or cover photo!</p>';
    html+='</div>';
    // Cover Photos
    html+='<div class="photo-album-section"><h3><i class="fas fa-panorama"></i> Cover Photos</h3>';
    if(state.photos.cover.length){html+='<div class="photo-album-grid">';state.photos.cover.forEach(function(p){html+='<img src="'+p.src+'">';});html+='</div>';}
    else html+='<p class="photo-album-empty">No cover photos yet.</p>';
    html+='</div>';
    // Post Photos
    html+='<div class="photo-album-section"><h3><i class="fas fa-newspaper"></i> Post Photos</h3>';
    if(state.photos.post.length){html+='<div class="photo-album-grid">';state.photos.post.forEach(function(p){html+='<img src="'+p.src+'">';});html+='</div>';}
    else html+='<p class="photo-album-empty">No post photos yet. Create a post with images!</p>';
    html+='</div>';
    // Custom Albums
    state.photos.albums.forEach(function(album,ai){
        html+='<div class="photo-album-section"><h3><i class="fas fa-folder"></i> '+album.name+' <button class="btn btn-primary album-add-btn" data-ai="'+ai+'" style="padding:4px 12px;font-size:12px;margin-left:8px;"><i class="fas fa-plus"></i> Add</button></h3>';
        if(album.photos.length){html+='<div class="photo-album-grid">';album.photos.forEach(function(p){html+='<img src="'+p.src+'">';});html+='</div>';}
        else html+='<p class="photo-album-empty">No photos in this album yet.</p>';
        html+='</div>';
    });
    $('#photoAlbumContent').innerHTML=html;
    // Lightbox handled by delegated click listener
    $('#createAlbumBtn').addEventListener('click',function(){
        var mHtml='<div class="modal-header"><h3>Create Album</h3><button class="modal-close"><i class="fas fa-times"></i></button></div>';
        mHtml+='<div class="modal-body"><label style="display:block;font-size:14px;font-weight:500;margin-bottom:6px;">Album Name</label><input type="text" id="albumNameInput" placeholder="My Album" style="width:100%;padding:10px;border:1px solid var(--border);border-radius:8px;font-size:14px;margin-bottom:16px;font-family:inherit;">';
        mHtml+='<button class="btn btn-primary" id="albumCreateConfirm" style="width:100%;">Create</button></div>';
        showModal(mHtml);
        document.getElementById('albumCreateConfirm').addEventListener('click',function(){
            var name=document.getElementById('albumNameInput').value.trim();
            if(!name)return;
            state.photos.albums.push({name:name,photos:[]});
            closeModal();renderPhotoAlbum();renderPhotosCard();
        });
    });
    $$('.album-add-btn').forEach(function(btn){
        btn.addEventListener('click',function(){
            var ai=parseInt(btn.dataset.ai);
            var input=document.createElement('input');input.type='file';input.accept='image/*';input.multiple=true;
            input.addEventListener('change',function(){
                Array.from(input.files).forEach(function(f){
                    var r=new FileReader();
                    r.onload=function(e){state.photos.albums[ai].photos.unshift({src:e.target.result,date:Date.now()});renderPhotoAlbum();renderPhotosCard();};
                    r.readAsDataURL(f);
                });
            });
            input.click();
        });
    });
}
function showPhotoLightbox(src){
    showModal('<div class="modal-header"><h3>Photo</h3><button class="modal-close"><i class="fas fa-times"></i></button></div><div class="modal-body" style="padding:0;text-align:center;"><img src="'+src+'" style="width:100%;border-radius:0 0 14px 14px;display:block;"></div>');
}
$('#viewAllPhotos').addEventListener('click',function(e){e.preventDefault();renderPhotoAlbum();navigateTo('photos');});
$$('.photos-back-link').forEach(function(l){l.addEventListener('click',function(e){e.preventDefault();navigateTo('home');});});

// ======================== SAVE POST MODAL ========================
function showSaveModal(pid){
    var existing=findPostFolder(pid);
    var h='<div class="modal-header"><h3><i class="fas fa-bookmark" style="color:var(--primary);margin-right:8px;"></i>'+(existing?'Move Post':'Save Post')+'</h3><button class="modal-close"><i class="fas fa-times"></i></button></div>';
    h+='<div class="modal-body">';
    if(existing) h+='<p style="font-size:13px;color:var(--gray);margin-bottom:12px;">Currently in: <strong>'+existing.name+'</strong></p>';
    h+='<p style="font-size:14px;font-weight:600;margin-bottom:10px;">Add to Folder</p>';
    h+='<div id="saveFolderList" style="display:flex;flex-direction:column;gap:6px;">';
    savedFolders.forEach(function(f){
        var inThis=existing&&existing.id===f.id;
        h+='<button class="btn '+(inThis?'btn-disabled':'btn-outline')+' save-folder-pick" data-fid="'+f.id+'" style="text-align:left;justify-content:flex-start;display:flex;align-items:center;gap:8px;"><i class="fas fa-folder" style="color:var(--primary);"></i>'+f.name+(inThis?' <span style="margin-left:auto;font-size:11px;color:var(--gray);">Current</span>':'')+'</button>';
    });
    h+='<button class="btn btn-outline" id="saveNewFolderBtn" style="text-align:left;display:flex;align-items:center;gap:8px;"><i class="fas fa-folder-plus" style="color:var(--green);"></i>+ Create New Folder</button>';
    h+='<div id="saveNewFolderInput" style="display:none;margin-top:6px;"><div style="display:flex;gap:8px;"><input type="text" id="saveNewFolderName" placeholder="Folder name..." style="flex:1;padding:8px 12px;border:2px solid var(--border);border-radius:8px;font-size:14px;"><button class="btn btn-primary" id="saveNewFolderConfirm" style="padding:8px 16px;">Add</button></div></div>';
    h+='</div></div>';
    showModal(h);
    // Bind folder picks
    $$('#saveFolderList .save-folder-pick').forEach(function(btn){
        btn.addEventListener('click',function(){
            if(btn.classList.contains('btn-disabled')) return;
            savePostToFolder(pid,btn.dataset.fid);
            closeModal();
            showToast('Post saved to '+savedFolders.find(function(f){return f.id===btn.dataset.fid;}).name);
        });
    });
    document.getElementById('saveNewFolderBtn').addEventListener('click',function(){
        document.getElementById('saveNewFolderInput').style.display='block';
        document.getElementById('saveNewFolderName').focus();
    });
    document.getElementById('saveNewFolderConfirm').addEventListener('click',function(){
        var name=document.getElementById('saveNewFolderName').value.trim();
        if(!name) return;
        var fid='folder-'+Date.now();
        savedFolders.push({id:fid,name:name,posts:[]});
        savePostToFolder(pid,fid);
        closeModal();
        showToast('Post saved to '+name);
    });
}
function savePostToFolder(pid,fid){
    var s=String(pid);
    // Remove from any existing folder
    savedFolders.forEach(function(f){var idx=f.posts.indexOf(s);if(idx!==-1)f.posts.splice(idx,1);});
    // Add to target
    var target=savedFolders.find(function(f){return f.id===fid;});
    if(target) target.posts.push(s);
    persistSaved();
}

// ======================== REPORT MODAL ========================
function showReportModal(pid){
    var h='<div class="modal-header"><h3><i class="fas fa-flag" style="color:#e74c3c;margin-right:8px;"></i>Report Post</h3><button class="modal-close"><i class="fas fa-times"></i></button></div>';
    h+='<div class="modal-body"><p style="font-size:14px;margin-bottom:14px;color:var(--gray);">Why are you reporting this post?</p>';
    h+='<div style="display:flex;flex-direction:column;gap:8px;">';
    ['Spam','Abuse','Other'].forEach(function(r){
        h+='<button class="btn btn-outline report-reason-btn" data-reason="'+r+'" style="text-align:left;">'+r+'</button>';
    });
    h+='</div></div>';
    showModal(h);
    $$('.report-reason-btn').forEach(function(btn){
        btn.addEventListener('click',function(){
            reportedPosts.push({pid:pid,reason:btn.dataset.reason,time:Date.now()});
            persistReports();
            closeModal();
            showToast('Report submitted. Thank you.');
        });
    });
}

// ======================== HIDE POST ========================
function hidePost(pid){
    hiddenPosts[pid]=true;
    persistHidden();
    renderFeed(activeFeedTab);
    showUndoToast('Post hidden from your feed',function(){
        delete hiddenPosts[pid];
        persistHidden();
        renderFeed(activeFeedTab);
    });
}
function unhidePost(pid){
    delete hiddenPosts[pid];
    persistHidden();
}
function showHiddenPostsModal(){
    var pids=Object.keys(hiddenPosts);
    var h='<div class="modal-header"><h3><i class="fas fa-eye-slash" style="color:var(--primary);margin-right:8px;"></i>Hidden Posts ('+pids.length+')</h3><button class="modal-close"><i class="fas fa-times"></i></button></div>';
    h+='<div class="modal-body" style="max-height:60vh;overflow-y:auto;">';
    if(!pids.length){
        h+='<p style="text-align:center;color:var(--gray);padding:20px;">No hidden posts.</p>';
    } else {
        pids.forEach(function(pid){
            var p=feedPosts.find(function(fp){return String(fp.idx)===String(pid);});
            if(!p) return;
            var short=p.text.substring(0,100)+(p.text.length>100?'...':'');
            h+='<div class="hidden-post-item" style="display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid var(--border);">';
            h+='<img src="https://i.pravatar.cc/40?img='+p.person.img+'" style="width:40px;height:40px;border-radius:50%;flex-shrink:0;">';
            h+='<div style="flex:1;min-width:0;"><div style="font-size:13px;font-weight:600;">'+p.person.name+'</div><p style="font-size:12px;color:var(--gray);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">'+short+'</p></div>';
            h+='<button class="btn btn-outline unhide-btn" data-pid="'+pid+'" style="padding:6px 14px;font-size:12px;flex-shrink:0;"><i class="fas fa-eye"></i> Unhide</button>';
            h+='</div>';
        });
    }
    h+='</div>';
    showModal(h);
    $$('.unhide-btn').forEach(function(btn){
        btn.addEventListener('click',function(){
            unhidePost(btn.dataset.pid);
            showHiddenPostsModal();
            renderFeed(activeFeedTab);
        });
    });
}

// ======================== BLOCK USER SYSTEM ========================
function showBlockConfirmModal(person,onDone){
    var h='<div class="modal-header"><h3><i class="fas fa-ban" style="color:#e74c3c;margin-right:8px;"></i>Block '+person.name+'?</h3><button class="modal-close"><i class="fas fa-times"></i></button></div>';
    h+='<div class="modal-body">';
    h+='<p style="color:var(--gray);font-size:14px;text-align:center;margin-bottom:16px;">They won\'t be able to see your posts or interact with you. Their posts will be hidden from your feed.</p>';
    h+='<div class="modal-actions"><button class="btn btn-outline modal-close">Cancel</button><button class="btn" id="confirmBlockBtn" style="background:#e74c3c;color:#fff;"><i class="fas fa-ban"></i> Block</button></div>';
    h+='</div>';
    showModal(h);
    document.getElementById('confirmBlockBtn').addEventListener('click',function(){
        blockUser(person.id);
        closeModal();
        if(onDone) onDone();
    });
}
function blockUser(uid){
    blockedUsers[uid]=true;
    persistBlocked();
    // Unfollow them if following
    if(state.followedUsers[uid]){
        delete state.followedUsers[uid];
        state.following--;
    }
    // Remove from my followers
    var idx=myFollowers.indexOf(uid);
    if(idx!==-1){myFollowers.splice(idx,1);state.followers--;}
    updateFollowCounts();
    renderFeed(activeFeedTab);
    showToast('User blocked');
}
function unblockUser(uid){
    delete blockedUsers[uid];
    persistBlocked();
    renderFeed(activeFeedTab);
    showToast('User unblocked');
}
function showBlockedUsersModal(){
    var uids=Object.keys(blockedUsers);
    var h='<div class="modal-header"><h3><i class="fas fa-ban" style="color:#e74c3c;margin-right:8px;"></i>Blocked Users ('+uids.length+')</h3><button class="modal-close"><i class="fas fa-times"></i></button></div>';
    h+='<div class="modal-body" style="max-height:60vh;overflow-y:auto;">';
    if(!uids.length){
        h+='<p style="text-align:center;color:var(--gray);padding:20px;">No blocked users.</p>';
    } else {
        uids.forEach(function(uid){
            var p=people.find(function(x){return x.id===parseInt(uid);});
            if(!p) return;
            h+='<div style="display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid var(--border);">';
            h+='<img src="https://i.pravatar.cc/40?img='+p.img+'" style="width:40px;height:40px;border-radius:50%;flex-shrink:0;">';
            h+='<div style="flex:1;min-width:0;"><div style="font-size:13px;font-weight:600;">'+p.name+'</div><p style="font-size:12px;color:var(--gray);">'+p.bio+'</p></div>';
            h+='<button class="btn btn-outline unblock-btn" data-uid="'+uid+'" style="padding:6px 14px;font-size:12px;flex-shrink:0;color:#e74c3c;border-color:#e74c3c;"><i class="fas fa-unlock"></i> Unblock</button>';
            h+='</div>';
        });
    }
    h+='</div>';
    showModal(h);
    $$('.unblock-btn').forEach(function(btn){
        btn.addEventListener('click',function(){
            unblockUser(parseInt(btn.dataset.uid));
            showBlockedUsersModal();
        });
    });
}

// ======================== TOAST NOTIFICATION ========================
function showToast(msg){
    var t=document.createElement('div');
    t.className='dq-toast';
    t.textContent=msg;
    document.body.appendChild(t);
    requestAnimationFrame(function(){t.classList.add('show');});
    setTimeout(function(){t.classList.remove('show');setTimeout(function(){t.remove();},300);},2500);
}
function showUndoToast(msg,onUndo){
    $$('.dq-toast').forEach(function(el){el.remove();});
    var t=document.createElement('div');
    t.className='dq-toast dq-toast-undo';
    t.innerHTML='<span>'+msg+'</span><button class="dq-toast-undo-btn">Undo</button>';
    document.body.appendChild(t);
    var timer;
    t.querySelector('.dq-toast-undo-btn').addEventListener('click',function(){
        clearTimeout(timer);
        t.classList.remove('show');
        setTimeout(function(){t.remove();},300);
        if(onUndo) onUndo();
    });
    requestAnimationFrame(function(){t.classList.add('show');});
    timer=setTimeout(function(){t.classList.remove('show');setTimeout(function(){t.remove();},300);},5000);
}

// ======================== SAVED PAGE ========================
var _savedOpenFolder=null;
function renderSavedPage(){
    _savedOpenFolder=null;
    var container=document.getElementById('savedContent');
    if(!savedFolders.length||savedFolders.every(function(f){return f.posts.length===0;})){
        // Show empty + folders
        var h='';
        if(savedFolders.length){
            h+='<div class="shop-section-title"><i class="fas fa-folder"></i> Your Folders</div>';
            h+='<div class="shop-scroll-row scroll-2row">';
            savedFolders.forEach(function(f){h+=savedFolderCard(f);});
            h+='</div>';
        }
        h+='<div class="card" style="padding:40px;text-align:center;color:var(--gray);margin-top:20px;"><i class="fas fa-bookmark" style="font-size:36px;margin-bottom:12px;display:block;"></i><p>No saved posts yet.</p><p style="font-size:13px;margin-top:6px;">Use the <i class="fas fa-ellipsis-h"></i> menu on any post to save it.</p></div>';
        container.innerHTML=h;
    } else {
        var h='<div class="shop-section-title"><i class="fas fa-folder"></i> Your Folders</div>';
        h+='<div class="shop-scroll-row scroll-2row">';
        savedFolders.forEach(function(f){h+=savedFolderCard(f);});
        h+='</div>';
        // Show all saved posts
        h+='<div class="shop-section-title" style="margin-top:12px;"><i class="fas fa-bookmark"></i> All Saved Posts</div>';
        var allIds=[];
        savedFolders.forEach(function(f){f.posts.forEach(function(pid){if(allIds.indexOf(pid)===-1)allIds.push(pid);});});
        allIds.forEach(function(pid){
            var p=feedPosts.find(function(fp){return String(fp.idx)===pid;});
            if(p) h+=renderSavedPostCard(p);
        });
        if(!allIds.length) h+='<p style="color:var(--gray);padding:20px;">No posts saved yet.</p>';
        container.innerHTML=h;
    }
    initDragScroll('#savedContent');
    bindSavedPageEvents();
}
function savedFolderCard(f){
    var count=f.posts.length;
    return '<div class="card saved-folder-card" data-fid="'+f.id+'" style="min-width:220px;max-width:220px;flex-shrink:0;scroll-snap-align:start;cursor:pointer;overflow:hidden;">'
        +'<div style="height:80px;background:linear-gradient(135deg,var(--primary),#8b5cf6);display:flex;align-items:center;justify-content:center;"><i class="fas fa-folder-open" style="font-size:32px;color:rgba(255,255,255,.8);"></i></div>'
        +'<div style="padding:14px;">'
        +'<h4 style="font-size:14px;font-weight:600;margin-bottom:4px;">'+f.name+'</h4>'
        +'<p style="font-size:12px;color:var(--gray);">'+count+' post'+(count!==1?'s':'')+'</p>'
        +'<div style="display:flex;gap:6px;margin-top:8px;">'
        +'<button class="btn btn-outline saved-folder-rename" data-fid="'+f.id+'" style="padding:4px 10px;font-size:11px;border-radius:6px;"><i class="fas fa-pen"></i></button>'
        +(f.id!=='fav'?'<button class="btn btn-outline saved-folder-delete" data-fid="'+f.id+'" style="padding:4px 10px;font-size:11px;border-radius:6px;color:#e74c3c;border-color:#e74c3c;"><i class="fas fa-trash"></i></button>':'')
        +'</div></div></div>';
}
function renderSavedPostCard(p){
    var i=p.idx,person=p.person,text=p.text,badge=p.badge,loc=p.loc,likes=p.likes,genComments=p.comments,shares=p.shares;
    var short=text.substring(0,Math.min(160,text.length));var rest=text.substring(160);var hasMore=rest.length>0;
    var folder=findPostFolder(i);
    var html='<div class="card feed-post saved-post-item" data-spid="'+i+'">';
    html+='<div class="post-header">';
    html+='<img src="https://i.pravatar.cc/50?img='+person.img+'" alt="'+person.name+'" class="post-avatar">';
    html+='<div class="post-user-info"><div class="post-user-top"><h4 class="post-username">'+person.name+'</h4><span class="post-time">'+timeAgo(i)+'</span></div>';
    html+='<div class="post-badges"><span class="badge '+badge.cls+'"><i class="fas '+badge.icon+'"></i> '+badge.text+'</span>';
    if(folder) html+='<span class="badge badge-blue"><i class="fas fa-folder"></i> '+folder.name+'</span>';
    html+='</div></div>';
    html+='<button class="btn btn-outline saved-unsave-btn" data-pid="'+i+'" style="padding:4px 12px;font-size:12px;margin-left:auto;"><i class="fas fa-bookmark-slash"></i> Unsave</button>';
    html+='</div>';
    html+='<div class="post-description"><p>'+short+(hasMore?'<span class="view-more-text hidden">'+rest+'</span>':'')+'</p>'+(hasMore?'<button class="view-more-btn">view more</button>':'')+'</div>';
    if(p.images){var imgs=p.images;html+='<div class="post-media-grid pm-count-'+imgs.length+'">';imgs.forEach(function(src){html+='<div class="pm-thumb"><img src="'+src+'" alt="Post photo"></div>';});html+='</div>';}
    html+='<div class="post-actions"><div class="action-left">';
    html+='<button class="action-btn like-btn" data-post-id="'+i+'"><i class="'+(state.likedPosts[i]?'fas':'far')+' fa-thumbs-up"></i><span class="like-count">'+likes+'</span></button>';
    html+='<button class="action-btn comment-btn"><i class="far fa-comment"></i><span>'+genComments.length+'</span></button>';
    html+='<button class="action-btn share-btn"><i class="fas fa-share-from-square"></i><span>'+shares+'</span></button>';
    html+='</div></div>';
    html+='</div>';
    return html;
}
function renderSavedFolderView(fid){
    _savedOpenFolder=fid;
    var f=savedFolders.find(function(x){return x.id===fid;});
    if(!f) return renderSavedPage();
    var container=document.getElementById('savedContent');
    var h='<a href="#" class="saved-back-link" style="display:inline-flex;align-items:center;gap:6px;color:var(--primary);font-weight:500;font-size:14px;margin-bottom:16px;"><i class="fas fa-arrow-left"></i> Back to Saved</a>';
    h+='<div class="shop-section-title"><i class="fas fa-folder-open"></i> '+f.name+' <span style="font-weight:400;font-size:14px;color:var(--gray);">('+f.posts.length+')</span></div>';
    if(!f.posts.length){
        h+='<div class="card" style="padding:40px;text-align:center;color:var(--gray);"><p>This folder is empty.</p></div>';
    } else {
        f.posts.forEach(function(pid){
            var p=feedPosts.find(function(fp){return String(fp.idx)===pid;});
            if(p) h+=renderSavedPostCard(p);
        });
    }
    container.innerHTML=h;
    bindSavedPageEvents();
}
function bindSavedPageEvents(){
    var c=document.getElementById('savedContent');
    // Folder click
    c.querySelectorAll('.saved-folder-card').forEach(function(card){
        card.addEventListener('click',function(e){
            if(e.target.closest('.saved-folder-rename')||e.target.closest('.saved-folder-delete')) return;
            renderSavedFolderView(card.dataset.fid);
        });
    });
    // Rename
    c.querySelectorAll('.saved-folder-rename').forEach(function(btn){
        btn.addEventListener('click',function(e){
            e.stopPropagation();
            var f=savedFolders.find(function(x){return x.id===btn.dataset.fid;});
            if(!f) return;
            var h='<div class="modal-header"><h3>Rename Folder</h3><button class="modal-close"><i class="fas fa-times"></i></button></div>';
            h+='<div class="modal-body"><input type="text" id="renameFolderInput" value="'+f.name+'" style="width:100%;padding:10px 14px;border:2px solid var(--border);border-radius:8px;font-size:14px;margin-bottom:12px;"><button class="btn btn-primary" id="renameFolderConfirm" style="width:100%;">Rename</button></div>';
            showModal(h);
            document.getElementById('renameFolderInput').focus();
            document.getElementById('renameFolderConfirm').addEventListener('click',function(){
                var n=document.getElementById('renameFolderInput').value.trim();
                if(n){f.name=n;persistSaved();closeModal();if(_savedOpenFolder)renderSavedFolderView(_savedOpenFolder);else renderSavedPage();}
            });
        });
    });
    // Delete
    c.querySelectorAll('.saved-folder-delete').forEach(function(btn){
        btn.addEventListener('click',function(e){
            e.stopPropagation();
            var f=savedFolders.find(function(x){return x.id===btn.dataset.fid;});
            if(!f) return;
            var h='<div class="modal-header"><h3>Delete Folder</h3><button class="modal-close"><i class="fas fa-times"></i></button></div>';
            h+='<div class="modal-body"><p style="color:var(--gray);margin-bottom:16px;">Delete "<strong>'+f.name+'</strong>"? Saved post references will be removed.</p><div class="modal-actions"><button class="btn btn-primary modal-close">Cancel</button><button class="btn btn-outline" id="deleteFolderConfirm" style="color:#e74c3c;border-color:#e74c3c;">Delete</button></div></div>';
            showModal(h);
            document.getElementById('deleteFolderConfirm').addEventListener('click',function(){
                savedFolders=savedFolders.filter(function(x){return x.id!==f.id;});
                persistSaved();closeModal();renderSavedPage();
            });
        });
    });
    // Unsave
    c.querySelectorAll('.saved-unsave-btn').forEach(function(btn){
        btn.addEventListener('click',function(){
            var pid=btn.dataset.pid;
            savedFolders.forEach(function(f){var idx=f.posts.indexOf(String(pid));if(idx!==-1)f.posts.splice(idx,1);});
            persistSaved();
            if(_savedOpenFolder) renderSavedFolderView(_savedOpenFolder);
            else renderSavedPage();
            showToast('Post unsaved');
        });
    });
    // Back link
    var back=c.querySelector('.saved-back-link');
    if(back) back.addEventListener('click',function(e){e.preventDefault();renderSavedPage();});
    // View more
    c.querySelectorAll('.view-more-btn').forEach(function(btn){
        btn.addEventListener('click',function(){
            var span=btn.parentElement.querySelector('.view-more-text');
            if(span.classList.contains('hidden')){span.classList.remove('hidden');btn.textContent='view less';}
            else{span.classList.add('hidden');btn.textContent='view more';}
        });
    });
}
// Create folder button on page
document.getElementById('createFolderBtn').addEventListener('click',function(){
    var h='<div class="modal-header"><h3>Create Folder</h3><button class="modal-close"><i class="fas fa-times"></i></button></div>';
    h+='<div class="modal-body"><input type="text" id="newFolderNameInput" placeholder="Folder name..." style="width:100%;padding:10px 14px;border:2px solid var(--border);border-radius:8px;font-size:14px;margin-bottom:12px;"><button class="btn btn-primary" id="newFolderCreateConfirm" style="width:100%;">Create</button></div>';
    showModal(h);
    document.getElementById('newFolderNameInput').focus();
    document.getElementById('newFolderCreateConfirm').addEventListener('click',function(){
        var n=document.getElementById('newFolderNameInput').value.trim();
        if(!n) return;
        savedFolders.push({id:'folder-'+Date.now(),name:n,posts:[]});
        persistSaved();closeModal();renderSavedPage();
        showToast('Folder "'+n+'" created');
    });
});

// ======================== DRAG-TO-SCROLL ========================
function initDragScroll(container){
    $$(container+' .shop-scroll-row').forEach(function(row){
        var isDown=false,startX,scrollL,moved,velX=0,lastX=0,lastT=0,raf;
        function coast(){velX*=0.92;if(Math.abs(velX)>0.3){row.scrollLeft-=velX;raf=requestAnimationFrame(coast);}else{row.classList.remove('dragging');}};
        row.addEventListener('mousedown',function(e){isDown=true;moved=false;cancelAnimationFrame(raf);row.classList.remove('dragging');startX=e.pageX-row.offsetLeft;scrollL=row.scrollLeft;lastX=e.pageX;lastT=Date.now();velX=0;});
        row.addEventListener('mouseleave',function(){isDown=false;if(moved){coast();}else{row.classList.remove('dragging');}});
        row.addEventListener('mouseup',function(){isDown=false;if(moved){coast();}else{row.classList.remove('dragging');}});
        row.addEventListener('mousemove',function(e){if(!isDown)return;var dx=Math.abs(e.pageX-row.offsetLeft-startX);if(dx>5){moved=true;row.classList.add('dragging');}if(!moved)return;e.preventDefault();var now=Date.now(),dt=now-lastT||1;velX=0.8*velX+0.2*((e.pageX-lastX)/dt*16);lastX=e.pageX;lastT=now;row.scrollLeft=scrollL-(e.pageX-row.offsetLeft-startX);});
        row.addEventListener('click',function(e){if(moved){e.preventDefault();e.stopPropagation();moved=false;}},true);
    });
}

// ======================== INITIALIZE ========================
if(!state.activeTemplate){applyTemplate('spotlight',true);state.activeTemplate='spotlight';}
generatePosts();
renderSuggestions();
renderTrendingSidebar();
renderGroups();
renderProfiles();
renderShop();
renderMySkins();
renderMsgContacts();
renderNotifications();
renderPhotosCard();
updateCoins();
updateFollowCounts();

// ======================== LIGHTBOX ========================
(function(){
    var overlay=document.createElement('div');overlay.className='lightbox-overlay';
    overlay.innerHTML='<button class="lightbox-close"><i class="fas fa-times"></i></button><button class="lightbox-arrow lightbox-prev"><i class="fas fa-chevron-left"></i></button><img src="" alt=""><button class="lightbox-arrow lightbox-next"><i class="fas fa-chevron-right"></i></button><div class="lightbox-counter"></div>';
    document.body.appendChild(overlay);
    var img=overlay.querySelector('img'),prev=overlay.querySelector('.lightbox-prev'),next=overlay.querySelector('.lightbox-next'),counter=overlay.querySelector('.lightbox-counter');
    var srcs=[],idx=0,tx=0,dragging=false;

    function open(list,i){srcs=list;idx=i;show();}
    window._openLightbox=open;
    function show(){img.src=srcs[idx];counter.textContent=(idx+1)+' / '+srcs.length;prev.style.display=srcs.length>1?'':'none';next.style.display=srcs.length>1?'':'none';overlay.classList.add('show');document.body.style.overflow='hidden';}
    function close(){overlay.classList.remove('show');document.body.style.overflow='';}
    function go(d){idx=(idx+d+srcs.length)%srcs.length;show();}

    prev.addEventListener('click',function(){go(-1);});
    next.addEventListener('click',function(){go(1);});
    overlay.querySelector('.lightbox-close').addEventListener('click',close);
    overlay.addEventListener('click',function(e){if(e.target===overlay)close();});
    document.addEventListener('keydown',function(e){if(!overlay.classList.contains('show'))return;if(e.key==='Escape')close();if(e.key==='ArrowLeft')go(-1);if(e.key==='ArrowRight')go(1);});

    // Touch swipe
    overlay.addEventListener('touchstart',function(e){tx=e.touches[0].clientX;dragging=true;},{passive:true});
    overlay.addEventListener('touchend',function(e){if(!dragging)return;dragging=false;var dx=e.changedTouches[0].clientX-tx;if(Math.abs(dx)>50){dx>0?go(-1):go(1);}});

    // Collect image srcs from a container
    function collect(container){return Array.from(container.querySelectorAll('img')).map(function(i){return i.src;}).filter(Boolean);}

    // Delegate clicks on images in posts, albums, previews
    document.addEventListener('click',function(e){
        var t=e.target;if(t.tagName!=='IMG')return;
        // Post media grid
        var grid=t.closest('.post-media-grid');
        if(grid){var pgid=grid.dataset.pgid;var allMedia=pgid&&window['_media_'+pgid];var list;if(allMedia){list=allMedia.filter(function(m){return m.type==='image';}).map(function(m){return m.src;});}else{list=collect(grid);}if(list.length){open(list,list.indexOf(t.src));e.stopPropagation();return;}}
        // Photo album grid
        var album=t.closest('.photo-album-grid');
        if(album){var list=collect(album);if(list.length){open(list,list.indexOf(t.src));e.stopPropagation();return;}}
        // Photos preview sidebar
        var preview=t.closest('.photos-preview');
        if(preview){var list=collect(preview);if(list.length){open(list,list.indexOf(t.src));e.stopPropagation();return;}}
        // All media modal grid
        var am=t.closest('.all-media-grid');
        if(am){var list=collect(am);if(list.length){open(list,list.indexOf(t.src));e.stopPropagation();return;}}
    });
})();

});
