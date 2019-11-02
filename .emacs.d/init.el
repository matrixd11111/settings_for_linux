;; Все пакеты Melpha Gnu
(require 'package)
(let* ((no-ssl (and (memq system-type '(windows-nt ms-dos))
                    (not (gnutls-available-p))))
       (proto (if no-ssl "http" "https")))
  (when no-ssl
    (warn "\
Your version of Emacs does not support SSL connections,
which is unsafe because it allows man-in-the-middle attacks.
There are two things you can do about this warning:
1. Install an Emacs version that does support SSL and be safe.
2. Remove this warning from your init file so you won't see it again."))
  ;; Comment/uncomment these two lines to enable/disable MELPA and MELPA Stable as desired
  (add-to-list 'package-archives (cons "melpa" (concat proto "://melpa.org/packages/")) t)
  ;;(add-to-list 'package-archives (cons "melpa-stable" (concat proto "://stable.melpa.org/packages/")) t)
  (when (< emacs-major-version 24)
    ;; For important compatibility libraries like cl-lib
    (add-to-list 'package-archives (cons "gnu" (concat proto "://elpa.gnu.org/packages/")))))
(package-initialize)
;;ido - автозаполнение строки поиска каталогов
;;cyberpunk-theme - применение темы темной
(require 'ido)
(require 'cyberpunk-theme)

;;Подсветить язык Lisp строками
;; jedi - активация
;;IDO автодополнение открытия файлов и каталогов
(setq show-paren-style 'expression)
(setq ido-enable-flex-matching t)

;;Убрать меню бар и строку меню, автокомплит, яснипет, номера строк, IDO
;; projectile, подсветка Lisp
(menu-bar-mode 1)
(tool-bar-mode -1)
(global-linum-mode 1)
(ido-mode 1)

;;Настройка клавиш
(global-set-key (kbd "C-x M-n") 'nav-toggle) ;;nav
(global-set-key (kbd "C-c <") 'hs-toggle-hiding) ;;сворачивает функции по скобкам
(global-set-key (kbd "C-c >") 'hs-hide-all) ;;выделяет блок в скобках
(global-set-key (kbd "C-<left>") 'shrink-window-horizontally) ;;здвиг окна влево
(global-set-key (kbd "C-<right>") 'enlarge-window-horizontally) ;;здвиг окна вправо
(global-set-key (kbd "C-<up>") 'shrink-window) ;;здвиг окна вверх
(global-set-key (kbd "C-<down>") 'enlarge-window) ;;здвиг окна вниз
(global-set-key (kbd "C-x M-m") 'projectile-run-term)

;;прозрачный emacs
(set-frame-parameter (selected-frame) 'alpha '(85 . 50))

;;настройка jedi
(add-hook 'python-mode-hook 'jedi:setup)
(setq jedi:complete-on-dot t)

;;настройка virtualenv virtualenvwrapper
(require 'virtualenvwrapper)
;;(venv-initialize-interactive-shells) ;; if you want interactive shell support
(venv-initialize-eshell) ;; if you want eshell support
;; note that setting `venv-location` is not necessary if you
;; use the default location (`~/.virtualenvs`), or if the
;; the environment variable `WORKON_HOME` points to the right place
;;(setq venv-location "~/Documents/ProgectWeb/")
;;(setq jedi:server-command '("/home/matrix/.emacs.d/elpa/jedi-core-20190620.1820/"))
(require 'org-install)
(add-to-list 'auto-mode-alist '("\\.org$" . org-mode))
(define-key global-map "\C-cl" 'org-store-link)
(define-key global-map "\C-ca" 'org-agenda)
(setq org-log-done t)
