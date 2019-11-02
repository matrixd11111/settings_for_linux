;;; desktop-environment-autoloads.el --- automatically extracted autoloads
;;
;;; Code:
(add-to-list 'load-path (directory-file-name (or (file-name-directory #$) (car load-path))))

;;;### (autoloads nil "desktop-environment" "desktop-environment.el"
;;;;;;  (23972 45635 111561 655000))
;;; Generated autoloads from desktop-environment.el

(autoload 'desktop-environment-brightness-increment "desktop-environment" "\
Increment brightness by `desktop-environment-brightness-normal-increment'.

\(fn)" t nil)

(autoload 'desktop-environment-brightness-decrement "desktop-environment" "\
Increment brightness by `desktop-environment-brightness-normal-decrement'.

\(fn)" t nil)

(autoload 'desktop-environment-brightness-increment-slowly "desktop-environment" "\
Increment brightness by `desktop-environment-brightness-small-increment'.

\(fn)" t nil)

(autoload 'desktop-environment-brightness-decrement-slowly "desktop-environment" "\
Decrement brightness by `desktop-environment-brightness-small-decrement'.

\(fn)" t nil)

(autoload 'desktop-environment-volume-increment "desktop-environment" "\
Increment volume by `desktop-environment-volume-normal-increment'.

\(fn)" t nil)

(autoload 'desktop-environment-volume-decrement "desktop-environment" "\
Increment volume by `desktop-environment-volume-normal-decrement'.

\(fn)" t nil)

(autoload 'desktop-environment-volume-increment-slowly "desktop-environment" "\
Increment volume by `desktop-environment-volume-small-increment'.

\(fn)" t nil)

(autoload 'desktop-environment-volume-decrement-slowly "desktop-environment" "\
Decrement volume by `desktop-environment-volume-small-decrement'.

\(fn)" t nil)

(autoload 'desktop-environment-toggle-mute "desktop-environment" "\
Toggle between muted and un-muted.

\(fn)" t nil)

(autoload 'desktop-environment-toggle-microphone-mute "desktop-environment" "\
Toggle microphone between muted and un-muted.

\(fn)" t nil)

(autoload 'desktop-environment-keyboard-backlight-increment "desktop-environment" "\
Increment keyboard backlight by `desktop-environment-keyboard-backlight-normal-increment'.

\(fn)" t nil)

(autoload 'desktop-environment-screenshot "desktop-environment" "\
Take a screenshot of the screen in the current working directory.

\(fn)" t nil)

(autoload 'desktop-environment-screenshot-part "desktop-environment" "\
Take a partial screenshot in the current working directory.

The command asks the user to interactively select a portion of
the screen.

\(fn)" t nil)

(autoload 'desktop-environment-lock-screen "desktop-environment" "\
Lock the screen, preventing anyone without a password from using the system.

\(fn)" t nil)

(autoload 'desktop-environment-toggle-wifi "desktop-environment" "\
Toggle wifi adapter on and off.

\(fn)" t nil)

(autoload 'desktop-environment-toggle-bluetooth "desktop-environment" "\
Toggle bluetooth on and off.

\(fn)" t nil)

(defvar desktop-environment-mode nil "\
Non-nil if Desktop-Environment mode is enabled.
See the `desktop-environment-mode' command
for a description of this minor mode.
Setting this variable directly does not take effect;
either customize it (see the info node `Easy Customization')
or call the function `desktop-environment-mode'.")

(custom-autoload 'desktop-environment-mode "desktop-environment" nil)

(autoload 'desktop-environment-mode "desktop-environment" "\
Activate keybindings to control your desktop environment.

\\{desktop-environment-mode-map}

\(fn &optional ARG)" t nil)

;;;***

;; Local Variables:
;; version-control: never
;; no-byte-compile: t
;; no-update-autoloads: t
;; End:
;;; desktop-environment-autoloads.el ends here
