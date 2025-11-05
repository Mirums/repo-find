let input = document.querySelector('#search')

function findWords(input) {
    const debouncedFetch = debounce(async function (query) {
        const repos = await findRepos(query)
        seeHints(repos, input)
    }, 500)
    input.addEventListener('input', () => {
        if (input.value === '' || input.value === ' ') {
            seeHints([], '')
        } else {
            debouncedFetch(input.value);
        }
    })
}

function seeHints(wordsHints, inputEl) {
    let hints = document.querySelector('#hints');
    hints.innerHTML = ''
    if (wordsHints.length !== 0 && input !== '') {
        for (let i = 0; i < Math.min(5, wordsHints.length); i++) {
            let hintDiv = document.createElement('div');
            hintDiv.className = 'hints-components'
            hintDiv.textContent = wordsHints[i].name;
            hints.appendChild(hintDiv);
            hintDiv.addEventListener('click', () => {
                hintDiv.className = 'hints-components--active';
                addRepo(wordsHints[i])
                hints.innerHTML = ''
                inputEl.value = ''
                inputEl.focus()
            })
        }
    } else {
        hints.innerHTML = ''
    }
}

function addRepo(repo) {
    let favRepos = document.querySelector('#members')
    favRepos.className = 'members'
    let currentRepos = `
    <div class="current-members">
            Name: ${repo.name}<br>
            Owner: ${repo.owner.login}<br>
            Stars: ${repo.stargazers_count}
            <button class='delete-btn'></button>
    </div>

    `;

    favRepos.insertAdjacentHTML('beforeend', currentRepos)
    document.addEventListener('click', (event) => {
        if (event.target.classList.contains('delete-btn')) {
            event.target.closest('.current-members').remove();
        }
    })
}

function debounce(fn, delay) {
    let timeout
    return function (...args) {
        clearTimeout(timeout)
        timeout = setTimeout(() => {
            fn.apply(this, args)
        }, delay)
    }
}

async function findRepos(query) {
    const response = await fetch(`https://api.github.com/search/repositories?q=${query}`)
    const data = await response.json();
    return data.items;
}

findWords(input)