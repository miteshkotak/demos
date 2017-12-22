(() => {
  const $testButton = document.querySelector('.js-test-button')
  const $optOut = document.querySelector('.js-fb-opt-out')
  const $optIn = document.querySelector('.js-fb-opt-in')
  const $debugOutput = document.querySelector('.js-test-output')

  const addDebugMessage = (message) => {
    const li = document.createElement('li')
    li.innerText = message
    $debugOutput.appendChild(li)
  }

  $testButton.addEventListener('click', (e) => {
    // In a real app there will probably be more logic to an input then just
    // emitting an event. Therefore we check if fbq is defined
    // to avoid exceptions after deactivating tracking
    if (localStorage.getItem('fb-pixel-status') === 'opt-in') {
      window.fbq('trackCustom', 'PixelOptInTest')

      addDebugMessage('Event `PixelOptInTest` abgeschickt.')
    } else {
      addDebugMessage('Die Userin hat der Verwendung des Pixels nicht zugestimmt.')
    }
  })

  $optOut.addEventListener('click', () => {
    addDebugMessage('Opt Out-Button geklickt.')
  })

  $optIn.addEventListener('click', () => {
    addDebugMessage('Opt In-Button geklickt.')
  })
})()
