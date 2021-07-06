call plug#begin('~/.vim/plugged')
Plug 'neoclide/coc.nvim', {'branch': 'release'}
Plug 'tpope/vim-sensible'
Plug 'preservim/nerdcommenter'
Plug 'flazz/vim-colorschemes'
Plug 'chiel92/vim-autoformat'
call plug#end()

autocmd VimEnter * if len(filter(values(g:plugs), '!isdirectory(v:val.dir)'))
            \| PlugInstall --sync | source $MYVIMRC
            \| endif

" General

set history=9001
filetype plugin on
filetype indent on

" Set to auto read when a file is changed from the outside
set autoread

" UI

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

set signcolumn=number

set notimeout
set ttimeout

" Look

syntax enable
set termguicolors
"set background=dark
set encoding=utf8
set ffs=unix,dos,mac
colorscheme solarized8_dark
" Make vertical splits nicer looking
hi vertsplit guifg=fg guibg=bg
set fillchars+=vert:\⎜

" Files, backups and undo

set nobackup
set nowb
set noswapfile

" Allows searching of files anywhere in the working directory
set path=$PWD/**

" Text, tab and indent related

" Be smart when using tabs ;)
set smarttab

set expandtab
set shiftwidth=4
set tabstop=4

set autoindent
set smartindent
set nowrap

" Status line

set laststatus=2 " Always show
set statusline=%F\ %r\ %m%=l:\ %l,\ t:\ %L,\ c:\ %c

" File browsing
let g:netrw_banner = 0    " Disable the banner
let g:netrw_winsize = 25  " 25% width
let g:netrw_liststyle = 3 " Tree

" Custom commands

" Quick fuzzy matching for searching for files. NB: trailing
" spaces on these lines are important.
map <Leader>f :find
map <Leader>s :sfind
map <Leader>v :vert sfind

" Clear search results
map <Leader>C :let @/ = ""<CR>

" Resize windows with <CTRL>+[hjkl]
map <silent> <C-h> <C-w><
map <silent> <C-j> <C-W>-
map <silent> <C-k> <C-W>+
map <silent> <C-l> <C-w>>

" Autoformat

au BufWrite * :Autoformat
" To disable the fallback to vim's indent [...] set the following variables to 0.
let g:autoformat_autoindent = 0
let g:autoformat_retab = 0
let g:autoformat_remove_trailing_spaces = 0

" Coc / auto completion

" hide instead of unload buffers when abandonded
" According to coc:
" TextEdit might fail if hidden is not set.
set hidden

" Give more space for displaying messages.
set cmdheight=2

" Don't pass messages to |ins-completion-menu|.
set shortmess+=c

" Always show the signcolumn, otherwise it would shift the text each time
set signcolumn=number

nnoremap <silent> <leader>ld :call coc#float#close_all() <bar> call CocActionAsync('doHover')<cr>
nnoremap <silent> <leader>lh :call coc#float#close_all() <bar> call CocActionAsync('diagnosticInfo')<cr>
nnoremap <silent> <leader>lj :call coc#float#close_all() <bar> call CocActionAsync('jumpDefinition')<cr>
nnoremap <silent> <leader>lq :call coc#float#close_all()<cr>
nnoremap <silent> <leader>lf :call coc#float#scroll(1)<cr>
nnoremap <silent> <leader>lb :call coc#float#scroll(0)<cr>
