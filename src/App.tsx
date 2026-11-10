import { useEffect, useMemo, useState } from 'react'
import './App.css'

type Page = 'login' | 'main' | 'profile' | 'blog' | 'write' | 'detail'

interface Post {
  id: number
  title: string
  content: string
}

const readStoredPosts = (): Post[] => {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    const saved = window.localStorage.getItem('blogPosts')
    return saved ? (JSON.parse(saved) as Post[]) : []
  } catch {
    return []
  }
}

function App() {
  const [page, setPage] = useState<Page>('login')
  const [message, setMessage] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [posts, setPosts] = useState<Post[]>(readStoredPosts)
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null)
  const [editMode, setEditMode] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [editTitle, setEditTitle] = useState('')
  const [editContent, setEditContent] = useState('')

  useEffect(() => {
    window.localStorage.setItem('blogPosts', JSON.stringify(posts))
  }, [posts])

  const currentPost = useMemo(
    () => posts.find((post) => post.id === selectedPostId) ?? null,
    [posts, selectedPostId],
  )

  const closeSidebar = () => setSidebarOpen(false)

  const handleMenuSelect = (menuName: string) => {
    const normalized = menuName.trim().toLowerCase()

    if (normalized === 'my profile') {
      setPage('profile')
    } else if (normalized === 'blog') {
      setPage('blog')
    } else if (normalized === 'counsellor platform') {
      window.open('https://project.parkjieun3052.workers.dev/', '_blank', 'noopener,noreferrer')
    } else if (normalized === 'github') {
      window.open('https://github.com/parkjieun3052', '_blank', 'noopener,noreferrer')
    }

    closeSidebar()
  }

  const handleLogin = () => {
    const isValid = email.includes('@') && password.length >= 4

    if (isValid) {
      setMessage('로그인 성공')
      setPage('main')
      return
    }

    setMessage('로그인 실패')
    alert('아이디 비밀번호가 틀렸습니다')
  }

  const handleGuest = () => {
    setMessage('비회원으로 둘러보기')
    setPage('main')
  }

  const handleLogout = () => {
    setMessage('로그아웃 버튼 클릭\n로그인 페이지로 이동\n로그인 상태 해제')
    setPage('login')
    setEmail('')
    setPassword('')
    closeSidebar()
  }

  const handleSavePost = (event: React.FormEvent) => {
    event.preventDefault()

    if (!title.trim() || !content.trim()) {
      alert('제목과 내용을 모두 입력해주세요.')
      return
    }

    const nextPost: Post = {
      id: Date.now(),
      title: title.trim(),
      content: content.trim(),
    }

    setPosts((previousPosts) => [...previousPosts, nextPost])
    setTitle('')
    setContent('')
    setPage('blog')
  }

  const handleDeletePost = () => {
    if (!selectedPostId) {
      return
    }

    const confirmed = window.confirm('이 글을 삭제하시겠습니까?')
    if (!confirmed) {
      return
    }

    setPosts((previousPosts) => previousPosts.filter((post) => post.id !== selectedPostId))
    setSelectedPostId(null)
    setEditMode(false)
    setPage('blog')
  }

  const handleEditStart = () => {
    if (!currentPost) {
      return
    }

    setEditTitle(currentPost.title)
    setEditContent(currentPost.content)
    setEditMode(true)
  }

  const handleEditSave = () => {
    if (!selectedPostId) {
      return
    }

    if (!editTitle.trim() || !editContent.trim()) {
      alert('제목과 내용을 모두 입력해주세요.')
      return
    }

    setPosts((previousPosts) =>
      previousPosts.map((post) =>
        post.id === selectedPostId
          ? { ...post, title: editTitle.trim(), content: editContent.trim() }
          : post,
      ),
    )
    setEditMode(false)
    setEditTitle('')
    setEditContent('')
  }

  const renderSidebar = () => (
    <>
      <div
        className={sidebarOpen ? 'overlay active' : 'overlay'}
        onClick={closeSidebar}
        aria-hidden="true"
      />
      <aside className={sidebarOpen ? 'sidebar open' : 'sidebar'} id="sidebar">
        <button type="button" className="close-btn" onClick={closeSidebar}>
          닫기
        </button>
        <h3>Menu</h3>
        <button type="button" className="menu-button" onClick={() => handleMenuSelect('my profile')}>
          my profile
        </button>
        <h4>my project</h4>
        <button type="button" className="menu-button" onClick={() => handleMenuSelect('blog')}>
          blog
        </button>
        <button type="button" className="menu-button" onClick={() => handleMenuSelect('counsellor platform')}>
          counsellor platform
        </button>
        <button type="button" className="menu-button" onClick={() => handleMenuSelect('github')}>
          github
        </button>
      </aside>
    </>
  )

  const renderMainContent = () => (
    <div className="page-shell">
      {renderSidebar()}
      <header className="topbar">
        <button type="button" className="menu-trigger" onClick={() => setSidebarOpen(true)}>
          메뉴
        </button>
        <button type="button" className="logout-btn" onClick={handleLogout}>
          로그아웃
        </button>
      </header>
      <main className="main-page">
        <h1>hello, World!</h1>
        <p>Welcome to the portfolio website</p>
      </main>
    </div>
  )

  const renderProfileContent = () => (
    <div className="page-shell">
      {renderSidebar()}
      <header className="topbar with-space">
        <button type="button" className="menu-trigger" onClick={() => setSidebarOpen(true)}>
          메뉴
        </button>
        <button type="button" className="secondary-btn" onClick={() => setPage('main')}>
          뒤로가기
        </button>
      </header>
      <main className="profile-page">
        <div className="profile-container">
          <div className="profile-img" aria-label="profile placeholder" />
          <div className="profile-info">
            <h2>My Profile</h2>
            <p>name : 박 지은</p>
            <p>age : 1999.00.00</p>
            <p>email : example@example.com</p>
            <p>phone : 010-1234-5678</p>
          </div>
        </div>

        <hr />

        <div className="introduce">
          <p>안녕하세요. 저는 박 지은입니다. 자기소개를 작성하는 공간입니다.</p>
        </div>
      </main>
    </div>
  )

  const renderBlogContent = () => (
    <div className="page-shell">
      {renderSidebar()}
      <header className="topbar with-space">
        <button type="button" className="menu-trigger" onClick={() => setSidebarOpen(true)}>
          메뉴
        </button>
        <button type="button" className="secondary-btn" onClick={() => setPage('main')}>
          뒤로가기
        </button>
      </header>
      <main className="blog-page">
        <h2>list of blog posts</h2>

        <ul className="post-list">
          {posts.length === 0 ? (
            <li>등록된 글이 없습니다.</li>
          ) : (
            [...posts].reverse().map((post) => (
              <li key={post.id}>
                <button type="button" className="post-link" onClick={() => {
                  setSelectedPostId(post.id)
                  setPage('detail')
                }}>
                  {post.title}
                </button>
              </li>
            ))
          )}
        </ul>

        <button type="button" className="primary-btn" onClick={() => setPage('write')}>
          글 작성하기
        </button>
      </main>
    </div>
  )

  const renderWriteContent = () => (
    <main className="write-page">
      <h2>새 글 작성</h2>
      <form onSubmit={handleSavePost} className="write-form">
        <label htmlFor="title">제목</label>
        <input id="title" type="text" value={title} onChange={(event) => setTitle(event.target.value)} required />

        <label htmlFor="content">내용</label>
        <textarea id="content" rows={10} value={content} onChange={(event) => setContent(event.target.value)} required />

        <div className="action-row">
          <button type="submit" className="primary-btn">등록하기</button>
          <button type="button" className="secondary-btn" onClick={() => setPage('blog')}>
            취소
          </button>
        </div>
      </form>
    </main>
  )

  const renderDetailContent = () => (
    <main className="detail-page">
      <h2>{currentPost ? currentPost.title : '글을 찾을 수 없습니다.'}</h2>
      <p>{currentPost ? currentPost.content : '삭제되었거나 존재하지 않는 게시글입니다.'}</p>

      <div className="action-row">
        <button type="button" className="secondary-btn" onClick={handleEditStart} disabled={!currentPost}>
          수정
        </button>
        <button type="button" className="secondary-btn" onClick={handleDeletePost} disabled={!currentPost}>
          삭제
        </button>
        <button type="button" className="secondary-btn" onClick={() => setPage('blog')}>
          목록으로
        </button>
      </div>

      {editMode && currentPost ? (
        <div className="edit-form">
          <input
            type="text"
            value={editTitle}
            onChange={(event) => setEditTitle(event.target.value)}
            placeholder="제목"
          />
          <textarea
            rows={8}
            value={editContent}
            onChange={(event) => setEditContent(event.target.value)}
            placeholder="내용"
          />
          <div className="action-row">
            <button type="button" className="primary-btn" onClick={handleEditSave}>
              저장
            </button>
            <button type="button" className="secondary-btn" onClick={() => setEditMode(false)}>
              취소
            </button>
          </div>
        </div>
      ) : null}
    </main>
  )

  return (
    <div className="app-shell">
      {page === 'login' ? (
        <main className="login-page">
          <h1>LOGIN</h1>
          <form className="login-form">
            <input
              type="text"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="이메일 형식으로 작성해주세요"
            />
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="4자리 이상 비밀번호를 입력해주세요"
            />
            <button type="button" className="primary-btn" onClick={handleLogin}>
              로그인
            </button>
            <button type="button" className="secondary-btn" onClick={handleGuest}>
              비회원으로 둘러보기
            </button>
          </form>
          <div className="message" aria-live="polite">
            {message}
          </div>
        </main>
      ) : null}

      {page === 'main' ? renderMainContent() : null}
      {page === 'profile' ? renderProfileContent() : null}
      {page === 'blog' ? renderBlogContent() : null}
      {page === 'write' ? renderWriteContent() : null}
      {page === 'detail' ? renderDetailContent() : null}
    </div>
  )
}

export default App
