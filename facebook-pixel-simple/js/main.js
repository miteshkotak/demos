(() => {
  const $testButton = document.querySelector('.js-test-button')
  const $optOut = document.querySelector('.js-fb-opt-out')
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
    if (window.hasOwnProperty('fbq')) {
      fbq('trackCustom', 'PixelOptOutTest')

      addDebugMessage('Event `PixelOptOutTest` abgeschickt.')
    } else {
      addDebugMessage('fbq war nicht definiert. Kein eigenes Event gesendet.')
    }
  })

  $optOut.addEventListener('click', () => {
    addDebugMessage('Opt Out-Link geklickt.')
  })
})()