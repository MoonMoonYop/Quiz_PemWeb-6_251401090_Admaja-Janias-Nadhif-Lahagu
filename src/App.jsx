
import { useState } from "react";
import { initialTodos } from "./data/dummy";
import "./App.css";

function MoonaLogo() {
  return (
    <div className="moona-logo-wrapper" title="Moona Hoshinova Task Manager">
      <img
        src="/moona-logo.jpeg"
        alt="Moona Logo"
        style={{
          width: 54,
          height: 54,
          borderRadius: "50%",
          objectFit: "cover",
        }}
      />
    </div>
  );
}

const emptyForm = {
  title: "",
  description: "",
  status: "to-do",
  priority: "low",
  deadline: "",
};

export default function App() {
  const [todos, setTodos] = useState(initialTodos);
  const [selectedTodoId, setSelectedTodoId] = useState(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [toast, setToast] = useState(null);

  const selectedTodo =
    todos.find((todo) => todo.id === selectedTodoId) || null;

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const openAddModal = () => {
    setFormData(emptyForm);
    setIsAddOpen(true);
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.deadline) {
      showToast("Judul dan deadline wajib diisi!", "error");
      return;
    }

    const newTodo = {
      id: todos.length
        ? Math.max(...todos.map((todo) => todo.id)) + 1
        : 1,
      title: formData.title.trim(),
      description: formData.description.trim() || "-",
      status: formData.status,
      priority: formData.priority,
      deadline: formData.deadline,
    };

    setTodos((prev) => [newTodo, ...prev]);
    setIsAddOpen(false);
    setFormData(emptyForm);
    showToast("Tugas baru berhasil ditambahkan!");
  };

  const openUpdateModal = (todo) => {
    setFormData({
      title: todo.title,
      description: todo.description,
      status: todo.status,
      priority: todo.priority,
      deadline: todo.deadline,
    });
    setIsUpdateOpen(true);
  };

  const handleUpdateSubmit = (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.deadline) {
      showToast("Judul dan deadline tidak boleh kosong!", "error");
      return;
    }

    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === selectedTodoId
          ? {
              ...todo,
              title: formData.title.trim(),
              description: formData.description.trim() || "-",
              status: formData.status,
              priority: formData.priority,
              deadline: formData.deadline,
            }
          : todo
      )
    );

    setIsUpdateOpen(false);
    showToast("Tugas berhasil diperbarui!");
  };

  const confirmDeleteTodo = () => {
    if (!deleteTarget) return;

    setTodos((prev) =>
      prev.filter((todo) => todo.id !== deleteTarget.id)
    );

    if (selectedTodoId === deleteTarget.id) {
      setSelectedTodoId(null);
    }

    showToast(`Tugas "${deleteTarget.title}" telah dihapus.`, "delete");
    setDeleteTarget(null);
  };

  return (
    <div className="app-container">
      <div className="stars-bg" aria-hidden="true"></div>

      {toast && (
        <div className={`toast-notification toast-${toast.type}`}>
          <span>{toast.message}</span>
        </div>
      )}

      {!selectedTodo ? (
        <main className="main-card">
          <header className="header-bar">
            <div className="brand-section">
              <MoonaLogo />
              <div>
                <h1 className="app-title">Moona Hoshinova Task List</h1>
                <p className="app-subtitle">
                  Moon Goodess Yang Akan Selalu Menemanimu 🌙
                </p>
              </div>
            </div>

            <button className="btn btn-primary" onClick={openAddModal}>
              + Tambah Muwalas
            </button>
          </header>

          <div className="table-wrapper">
            <table className="todo-table">
              <thead>
                <tr>
                  <th>Judul</th>
                  <th>Status</th>
                  <th>Prioritas</th>
                  <th>Deadline</th>
                  <th className="text-center">Aksi</th>
                </tr>
              </thead>

              <tbody>
                {todos.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="empty-state">
                      Belum ada daftar tugas. Klik{" "}
                      <strong>+ Tambah Todo</strong> untuk memulai!
                    </td>
                  </tr>
                ) : (
                  todos.map((todo) => (
                    <tr key={todo.id}>
                      <td className="col-title" title={todo.title}>
                        {todo.title}
                      </td>

                      <td>
                        <span className={`badge status-${todo.status.replace(/\s+/g, "-")}`}>
                          {todo.status}
                        </span>
                      </td>

                      <td>
                        <span className={`badge priority-${todo.priority}`}>
                          {todo.priority}
                        </span>
                      </td>

                      <td className="col-deadline">{todo.deadline}</td>

                      <td className="col-actions">
                        <button
                          className="icon-btn btn-view"
                          title="Lihat Detail Tugas"
                          onClick={() => setSelectedTodoId(todo.id)}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        </button>

                        <button
                          className="icon-btn btn-delete"
                          title="Hapus Tugas"
                          onClick={() => setDeleteTarget(todo)}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                            <path d="M10 11v6" />
                            <path d="M14 11v6" />
                            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </main>
      ) : (
        <main className="detail-wrapper">
          <div className="detail-card">
            <div className="detail-header-badge">
              <MoonaLogo />
              <span>Detail Tugas #{selectedTodo.id}</span>
            </div>

            <div className="detail-grid">
              <div className="detail-left">
                <div className="detail-group">
                  <label>Judul</label>
                  <p className="detail-title-text">{selectedTodo.title}</p>
                </div>

                <div className="detail-group">
                  <label>Deskripsi</label>
                  <div className="detail-desc-box">
                    {selectedTodo.description}
                  </div>
                </div>
              </div>

              <div className="detail-right">
                <div className="detail-group">
                  <label>Status</label>
                  <span className={`badge status-${selectedTodo.status.replace(/\s+/g, "-")}`}>
                    {selectedTodo.status}
                  </span>
                </div>

                <div className="detail-group">
                  <label>Prioritas</label>
                  <span className={`badge priority-${selectedTodo.priority}`}>
                    {selectedTodo.priority}
                  </span>
                </div>

                <div className="detail-group">
                  <label>Deadline</label>
                  <p className="detail-value">{selectedTodo.deadline}</p>
                </div>

                <div className="detail-actions">
                  <button
                    className="btn btn-danger"
                    onClick={() => setSelectedTodoId(null)}
                  >
                    Kembali
                  </button>

                  <button
                    className="btn btn-primary"
                    onClick={() => openUpdateModal(selectedTodo)}
                  >
                    Update
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      )}

      {isAddOpen && (
        <div className="modal-overlay" onClick={() => setIsAddOpen(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">Tambah Todo</h2>

            <form onSubmit={handleAddSubmit}>
              <div className="form-group">
                <label>Judul</label>
                <input
                  type="text"
                  name="title"
                  placeholder="Masukkan judul tugas..."
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Deskripsi</label>
                <textarea
                  name="description"
                  rows="3"
                  placeholder="Masukkan deskripsi tugas..."
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                  >
                    <option value="to-do">to-do</option>
                    <option value="in progress">in progress</option>
                    <option value="done">done</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Prioritas</label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                  >
                    <option value="low">low</option>
                    <option value="medium">medium</option>
                    <option value="high">high</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Deadline</label>
                <input
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-danger btn-full"
                  onClick={() => setIsAddOpen(false)}
                >
                  Batal
                </button>

                <button type="submit" className="btn btn-primary btn-full">
                  Tambah
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isUpdateOpen && (
        <div className="modal-overlay" onClick={() => setIsUpdateOpen(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">Update Todo</h2>

            <form onSubmit={handleUpdateSubmit}>
              <div className="form-group">
                <label>Judul</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Deskripsi</label>
                <textarea
                  name="description"
                  rows="3"
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                  >
                    <option value="to-do">to-do</option>
                    <option value="in progress">in progress</option>
                    <option value="done">done</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Prioritas</label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                  >
                    <option value="low">low</option>
                    <option value="medium">medium</option>
                    <option value="high">high</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Deadline</label>
                <input
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-danger btn-full"
                  onClick={() => setIsUpdateOpen(false)}
                >
                  Batal
                </button>

                <button type="submit" className="btn btn-primary btn-full">
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="modal-overlay" onClick={() => setDeleteTarget(null)}>
          <div
            className="modal-box modal-confirm"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="modal-title">Hapus Tugas?</h2>

            <p className="confirm-text">
              Apakah kamu yakin ingin menghapus tugas{" "}
              <strong>"{deleteTarget.title}"</strong>? Tindakan ini tidak
              dapat dibatalkan.
            </p>

            <div className="modal-actions">
              <button
                className="btn btn-secondary btn-full"
                onClick={() => setDeleteTarget(null)}
              >
                Batal
              </button>

              <button
                className="btn btn-danger btn-full"
                onClick={confirmDeleteTodo}
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
