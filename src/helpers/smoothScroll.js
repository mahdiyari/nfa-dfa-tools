/** Scroll smoothly to the id */
const smoothScroll = id => {
  document.querySelector('#' + id).scrollIntoView({
    block: 'start',
    behavior: 'smooth'
  })
}

exports.smoothScroll = smoothScroll
