'use strict'

class FacebookPixelController {
  constructor(userOptions) {
    const pixelStatus = 'fb-pixel-status'

    this.defaultOptions = {
      optOutButtonSelector: '.js-fb-opt-out',
      optInButtonSelector: '.js-fb-opt-in',
      cookieName: pixelStatus,
      localStorageKey: pixelStatus,
      secure: true,
      pixelId: '1944570812537922',
      fbScriptSrc: 'https://connect.facebook.net/de_DE/fbevents.js'
    }

    this.options = {
      ...this.defaultOptions,
      ...userOptions
    }

    this.$optOutButton =
        document.querySelector(this.options.optOutButtonSelector)
    this.$optInButton =
        document.querySelector(this.options.optInButtonSelector)

    this.usingStorage = FacebookPixelController.storageAvailable()

    // Bind this to static methods
    FacebookPixelController.setStorage =
        FacebookPixelController.setStorage.bind(this)
    FacebookPixelController.setCookie =
        FacebookPixelController.setCookie.bind(this)
    FacebookPixelController.disableTrackingFunction =
        FacebookPixelController.disableTrackingFunction.bind(this)
    FacebookPixelController.createTrackingScript =
        FacebookPixelController.createTrackingScript.bind(this)

    this.addEventListeners()
  }

  addEventListeners() {
    if (this.$optOutButton) {
      this.$optOutButton.addEventListener('click', (e) => {
        e.preventDefault()
        this.optOutController()
      })
    }

    if (this.$optInButton) {
      this.$optInButton.addEventListener('click', (e) => {
        e.preventDefault()
        this.optInController()
      })
    }
  }

  /**
   * Handle the opt out request of a user
   *
   * @memberof FacebookPixelController
   */
  optOutController() {
    if (this.usingStorage) {
      FacebookPixelController.setStorage('opt-out')
    }
    // Additionally set a cookie to allow for conditional rendering on the server
    FacebookPixelController.setCookie('opt-out')

    if (window.hasOwnProperty('fbq')) {
      FacebookPixelController.disableTrackingFunction()
    }
  }

  /**
   * Handle the opt in request of a user
   *
   * @memberof FacebookPixelController
   */
  optInController() {
    FacebookPixelController.setStorage('opt-in')

    FacebookPixelController.setCookie('opt-in')

    const s = FacebookPixelController.createTrackingScript()
    document.body.appendChild(s)
  }

  /**
   * Set an item in the localStorage to save the request of the user
   *
   * @static
   * @param {String} value
   * @memberof FacebookPixelController
   */
static setStorage(value) {
    if (value === 'opt-in' || value === 'opt-out') {
      localStorage.setItem(this.options.localStorageKey, value)
    } else {
      console.error('Invalid state. Use opt-in or opt-out.')
    }
  }

  static setCookie(status) {
    if (status === 'opt-in' || status === 'opt-out') {
      const secure = this.options.secure ? 'secure' : ''

      if (secure && location.protocol === 'http:') {
        console.warn('Trying to set a secure cookie in an insecure context. This won’t work.')
      }

      document.cookie = `${this.options.cookieName}=${status}; expires=Fri, 30 Jan 2071 23:00:00 GMT; ${secure}; path=/`
    } else {
      console.error('Invalid state to set the status cookie. Use `opt-in` or `opt-out`.')
    }
  }

  /**
   * If the user disables tracking but stays on the site and/or the app just
   * updates the view when navigating, Facebook’s fbq() function needs to be disabled
   *
   * @static
   * @memberof FacebookPixelController
   */
  static disableTrackingFunction() {
    delete window.fbq
  }

  /**
   * Check the current status of the opt in/out request
   *
   * @returns {String}
   * @memberof FacebookPixelController
   */
  getStatus() {
    if (this.usingStorage) {
      return localStorage.getItem(this.options.localStorageKey)
    }
  }

  hasOptedOut() {
    if (this.usingStorage) {
      return localStorage.getItem(this.options.localStorageKey) === 'opt-out'
    }
  }

  static createTrackingScript() {
    const script = document.createElement('script')

    script.innerText = `!function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      '${this.options.fbScriptSrc}');
      fbq('init', '${this.options.pixelId}');
      fbq('track', 'PageView');`

    return script
  }

  /**
   * Make sure that localStorage is available before using it.
   * Source: https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API
   *
   * @static
   * @returns {Boolean}
   * @memberof FacebookPixelController
   */
  static storageAvailable() {
    const storage = localStorage
    const x = '__storage_test__'

    try {
      storage.setItem(x, x)
      storage.removeItem(x)
      return true
    }
    catch(e) {
      return e instanceof DOMException && (
        // everything except Firefox
        e.code === 22 ||
        // Firefox
        e.code === 1014 ||
        // test name field too, because code might not be present
        // everything except Firefox
        e.name === 'QuotaExceededError' ||
        // Firefox
        e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
        // acknowledge QuotaExceededError only if there's something already stored
        storage.length !== 0
    }
  }
}

new FacebookPixelController()
