export default class MemoryGameUI {
    static colors = [{
        color: 'purple',
        hex: '#8b6dff'
      },
      {
        color: 'magenta',
        hex: '#df6dff'
      },
      {
        color: 'pink',
        hex: '#ff6bc7'
      },
      {
        color: 'red',
        hex: '#ff7670'
      },
      {
        color: 'orange',
        hex: '#ffc16c'
      },
      {
        color: 'lemon',
        hex: '#ddff6c'
      },
      {
        color: 'lime',
        hex: '#9dff86'
      },
      {
        color: 'green',
        hex: '#6dffac'
      },
      {
        color: 'cyan',
        hex: '#6bffff'
      },
      {
        color: 'blue',
        hex: '#6eaaff'
      }
    ]

    static animateTextColor(el) {
        const numOfColors = MemoryGameUI.colors.length;
        let colorIndex = 0;
    
        let characters = el.innerText.split('').map((char, i) => {
            if(char && char != ' ') {
                if(colorIndex > numOfColors - 1) colorIndex = 0;
                const element = document.createElement('span');
                element.innerText = char;
                element.classList.add('invisible');
                element.dataset.colorIndex = colorIndex;
                colorIndex += 1;
                return element;
            } else {
                return char
            }
        });
        
        el.innerHTML = '';
        el.classList.add('animated');
        for(let char of characters) {
            el.append(char);
        }
    
        const spans = el.querySelectorAll(`span`);
        let i = 0;
        const appendColorClasses = setInterval(
            function () {
                const color = MemoryGameUI.colors[spans[i].dataset.colorIndex];
                spans[i].classList.add(color.color);
                spans[i].classList.remove('invisible');
                spans[i].style.transform = `rotate(${MemoryGameUI.randomDeg(0,20)}deg)`;
                i++
                if(i >= spans.length)  {
                 clearInterval(appendColorClasses);
                }
            },
        100)
    }

    static randomDeg(min,max) {
        let deg = Math.floor((Math.random() * max) + min);
        const rotation = deg % 2 === 0 ? 1 : -1; 
        return deg * rotation;
    }
    static renderLogo() {
        const logo = document.createElement('h1');
        logo.id = "game-title";
        logo.innerText = 'Memory Game';
        return logo;
    }
    static renderGitHubLink() {
        let gitHubLink = document.createElement('a');
        gitHubLink.classList.add('github-link');
        gitHubLink.innerHTML = '<i class="fab fa-github"></i>';
        gitHubLink.href = 'https://github.com/tannguyendeveloper/memory-game';
        return gitHubLink;
    }
    static renderButton(text, fn) {
        const btn = document.createElement('button');
        btn.innerHTML = text;
        btn.addEventListener('click', fn);
        return btn
    }

    static renderModal() {
        const modal = document.createElement('div');
        modal.classList.add('modal');
        const container = document.createElement('div');
        container.classList.add('modal-container');
        for(let argument of arguments) {
            container.append(argument);
        }
        modal.append(container)
        return modal;
    }
}
