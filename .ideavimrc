" Inspired by http://amix.dk/vim/vimrc.html

"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
" => General
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
set history=9001
filetype plugin on
filetype indent on

" Set to auto read when a file is changed from the outside
set autoread

" default leader is \ so let's try using it.

"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
" => VIM user interface
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
set wildmenu
set wildmode=full

set hlsearch
set incsearch
" For regular expressions turn magic on
set magic

" Show matching brackets when text indicator is over them
set showmatch
" How many tenths of a second to blink when matching brackets
set mat=2

" Relative line numbers
set rnu

"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
" => Colors and Fonts
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
syntax enable
set termguicolors
set background=dark
set encoding=utf8
set ffs=unix,dos,mac

" Make vertical splits nicer looking
hi vertsplit guifg=fg guibg=bg
set fillchars+=vert:\⎜

"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
" => Files, backups and undo
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
set nobackup
set nowb
set noswapfile

" Allows searching of files anywhere in the working directory
set path=$PWD/**

"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
" => Text, tab and indent related
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
" Be smart when using tabs ;)
set smarttab

set shiftwidth=4
set tabstop=4

set autoindent
set smartindent
set nowrap

""""""""""""""""""""""""""""""
" => Status line
""""""""""""""""""""""""""""""
set laststatus=2 " Always show
set statusline=%F\ %r\ %m%=l:\ %l,\ t:\ %L,\ c:\ %c

" File browsing
let g:netrw_banner = 0    " Disable the banner
let g:netrw_winsize = 25  " 25% width
let g:netrw_liststyle = 3 " Tree

"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
" => Custom commands
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
" Quick fuzzy matching for searching for files. NB: trailing
" spaces on these lines are important.
map <Leader>f :find 
map <Leader>s :sfind 
map <Leader>v :vert sfind 

" Clear search results
map <Leader>c :let @/ = ""<CR>

" Resize windows with <CTRL>+[hjkl]
map <silent> <C-h> <C-w><
map <silent> <C-j> <C-W>-
map <silent> <C-k> <C-W>+
map <silent> <C-l> <C-w>>
