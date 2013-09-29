# css3applet
==========

## What's this?
* Use css3 to create appearance of checkbox, input, select, radio...to instead of the default for Mobile browser which able to get `same good looking`~
* Supported:
  * `android 4.x`
  * `android 2.3.x`
  * `ios 6.x`
  * `ios 5.x`
  * `wp 8.0.x`

## What are they?
* input
  * radio
  * input
      * we did not set `appearance: none` to `<input>`.
      * Set attribute of `pattern="[0-9]*"` for Mobile browser to show number input only
  * checkbox
* select
  * we need use add a container with class `mb-select-container` out of `<select>` for show the triangle of the right. see: `<span class="mb-select-container"><select class="mb-select""></select></span>`

## About:
* v1.0.0
* author: ian.li
