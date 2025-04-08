const startScreen = document.getElementById('start-screen');
const choiceScreen = document.getElementById('choice-screen');
const endScreen = document.getElementById('end-screen');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const sceneText = document.querySelector('.scene-text');
const endText = document.getElementById('end-text');
const endImage = document.getElementById('end-image');
const rainVideo = document.getElementById('rain-video');
const rainSound = document.getElementById('rain-sound');
const backgroundImage = document.getElementById('background-image')
const choicesContainer = document.querySelector('.choices');


// 故事数据结构
const story = {
    start: {
        text: "Woke Up early in the morning, it is raining outside...",
        choices: [
            { text: "Go back to sleep", next: "sleep" },
            { text: "Get up for Breakfast!", next: "breakfast" }
        ],
        hasRain: true 
    },
    breakfast: {
        text: "You have made yourself a yummy breakfast!",
        choices: [
            { text: "continue", next: "Work" },
        ],
        hasRain: false, 
        image: "Images/Breakfast.jpg"
    },
    Work: {
         text: "Breakfast is done! What's Next?",
         choices: [
             { text: "Let's go out!", next: "Drive" },
             { text: "Work from home", next: "Remote" },
         ],
         hasRain: false,
         image: "Images/Breakfast.jpg"
    },
    Remote: {
        text: "Working at home with my puppy feels NICE!",
        choices: [
            { text: "continue", next: "FinalEnd2" },
        ],
        hasRain: false, 
        image: "Images/Workfromhome.jpg"
    },
    Drive: {
        text: "Where should we go",
        choices: [
            { text: "Work!", next: "ToOffice" },
            { text: "Play!", next: "Play" },
        ],
        hasRain: false, 
        image: "Images/Breakfast.jpg"
    },
    ToOffice: {
        text: "Puppy is with you! But doesn not look happy",
        choices: [
            { text: "continue", next: "FinalEnd2" },
        ],
        hasRain: false, 
        image: "Images/Sure.jpg"
    },
    Play: {
         text: "Puppies are having fun!",
         choices: [
            { text: "continue", next: "FinalEnd2" },
         ],
         hasRain: false,
         image: "Images/Drive.jpg"
    },
    sleep: {
        text: "You Slept to Afternoon and Missed your Class!",
        choices: [
            { text: "continue", next: "Getup" },
        ],
        hasRain: false, 
        image: "Images/Sleep.jpg"
    },
   Getup: {
        text: "You Slept to Afternoon and missed your Class!",
        choices: [
            { text: "Meh, Make a Coffee", next: "Coffee" },
            { text: "Get out and enjoy a free day!", next: "GetOut" },
        ],
        hasRain: false,
        image: "Images/Sleep.jpg"
    },
    Coffee: {
        text: "You brew yourself a nice hot Latte!",
        choices: [
            { text: "continue", next: "Email" },
        ],
        hasRain: false,
        image: "Images/Coffee.jpg"
    },
    GetOut: {
        text: "You have a fun day at the Gym!",
        choices: [
            { text: "continue", next: "Email2" },
        ],
        hasRain: false,
        image: "Images/Getout.jpg"
    },
    Email: {
         text: "Ding! Your outlook has a new notification",
         choices: [
             { text: "Open", next: "Open" },
             { text: "Dang have to see it", next: "Open" },
         ],
         hasRain: false,
         image: "Images/Coffee.jpg"
    },
    Email2: {
        text: "Ding! Your outlook has a new notification",
        choices: [
            { text: "Open", next: "Open" },
            { text: "Dang have to see it", next: "Open" },
        ],
        hasRain: false,
        image: "Images/Getout.jpg"
    },
    Open: {
        text: "Your Professor is COMING AFTER YOU",
        choices: [
            { text: "Fece the consequences", next: "FinalEnd" },
        ],
        hasRain: false,
        image: "Images/why-didnt-you-work.jpg"
    },
    FinalEnd: {
        text: "Get Up Early next time! Thanks for playing!",
        isFinalEnd: true,
        image: "Images/why-didnt-you-work.jpg"
    },
    FinalEnd2: {
        text: "Efficient! Thanks for playing!",
        isFinalEnd: true,
        image: "Images/Greatjob.jpg"
    }
}

let currentScene = "start";
let isAudioEnabled = false; // 用户是否开启音效

const audioBtn = document.createElement('button');
audioBtn.className = 'audio-control';
audioBtn.innerHTML = '🔇'; // 初始静音状态
document.body.appendChild(audioBtn);

// 音频开关控制
audioBtn.addEventListener('click', () => {
    isAudioEnabled = !isAudioEnabled;
    audioBtn.innerHTML = isAudioEnabled ? '🔊' : '🔇';

    if (isAudioEnabled) {
        // 如果当前是下雨场景，则播放雨声
        if (story[currentScene].hasRain) {
            rainSound.play().catch(e => {
                console.log("需要用户交互后才能播放声音");
                audioBtn.innerHTML = '⛔';
            });
        }
    } else {
        rainSound.pause();
    }
});

// 加载场景
function loadScene(sceneId) {
    const scene = story[sceneId];
    currentScene = sceneId;
    sceneText.textContent = scene.text;

    // 下雨场景控制
    if (scene.hasRain) {
        backgroundImage.style.display = "none";
        rainVideo.style.display = "block";
        rainVideo.play().catch(e => console.log("视频播放失败:", e));

        if (isAudioEnabled) {
            rainSound.play().catch(e => console.log("音频播放失败:", e));
        }
    } else {
        // 隐藏视频并停止雨声
        rainVideo.style.display = "none";
        rainSound.pause();

        if(scene.image) {
            backgroundImage.src = scene.image;
            backgroundImage.style.display = "block";
        }
    }

    // 原有场景加载逻辑...
    if (scene.isFinalEnd) {
        showEndScene(scene);
    } else {
        updateChoices(scene);
    }
}

// 更新选项按钮
function updateChoices(scene) {
    // 隐藏其他屏幕，显示选择屏
    startScreen.classList.add('hidden');
    endScreen.classList.add('hidden');
    choiceScreen.classList.remove('hidden');

    // 清空旧选项
    const choicesContainer = document.querySelector('.choices');
    choicesContainer.innerHTML = '';

    // 添加新选项按钮
    scene.choices.forEach(choice => {
        const button = document.createElement('button');
        button.textContent = choice.text;
        button.classList.add('choice-btn');
        button.dataset.next = choice.next;
        button.addEventListener('click', () => {
            loadScene(choice.next); // 加载下一个场景
        });
        choicesContainer.appendChild(button);
    });
}

// 显示结局
function showEndScene(scene) {
    choiceScreen.classList.add('hidden');
    endScreen.classList.remove('hidden');
    endText.textContent = scene.text;

    if (scene.image) {
        endImage.src = scene.image;
        endImage.style.display = 'block';
    } else {
        endImage.style.display = 'none';
    }

    const choicesContainer = document.querySelector('.choices');
    choicesContainer.innerHTML = '';

    if (scene.isFinalEnd) {
        const finalBtn = document.createElement('button');
        finalBtn.textContent = "Play Again from Start";
        finalBtn.classList.add('final-btn'); // 可以给这个按钮特殊样式
        finalBtn.addEventListener('click', () => {
            endScreen.classList.add('hidden');
            startScreen.classList.remove('hidden');
            currentScene = "start";
            loadScene(currentScene);
        });
        choicesContainer.appendChild(finalBtn);
    }
}

// ======================
// 事件监听器
// ======================
startBtn.addEventListener('click', () => {
    startScreen.classList.add('hidden');
    choiceScreen.classList.remove('hidden');
    loadScene(currentScene);
});

restartBtn.addEventListener('click', () => {
    endScreen.classList.add('hidden');
    startScreen.classList.remove('hidden');
    currentScene = "start";
    loadScene(currentScene); // 重置时需要重新加载场景
});
