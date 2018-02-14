const pixelDebugHelper = () => {
  const $testButton = document.querySelector('.js-test-button')
  const $optOut = document.querySelector('.js-fb-opt-out')
  const $debugOutput = document.querySelector('.js-test-output')

  const optOutWish = () => {
    const doNotTrack = navigator.doNotTrack === '1'
    const hasOptedOut = localStorage.getItem('fb-pixel-status') === 'opt-out'
    return doNotTrack || hasOptedOut
  }

  const addDebugMessage = (message) => {
    const li = document.createElement('li')
    li.innerText = message
    $debugOutput.appendChild(li)
  }

  const setDebugStatus = () => {
    $status = document.querySelector('.js-opt-out-status')
    const optOut = optOutWish()
    const text = optOut ? 'Pixel ist deaktiviert.' : 'Pixel ist aktiviert.'

    $status.innerText = text
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

    setDebugStatus()
  })

  $optOut.addEventListener('click', () => {
    addDebugMessage('Opt Out-Link geklickt.')
    setDebugStatus()
  })
}

window.addEventListener('load', () => {
  pixelDebugHelper()
})