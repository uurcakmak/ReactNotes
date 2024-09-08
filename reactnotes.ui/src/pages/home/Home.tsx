/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { useTable, Column } from 'react-table';
import Swal from 'sweetalert2';
import { Modal, Button, Form } from 'react-bootstrap';
import { getAllNotes, createNote, deleteNote, updateNote, Note } from './../../services/noteService';
import moment from 'moment'; // Import moment.js

const Home: React.FC = () => {
    const [notes, setNotes] = useState<Note[]>([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [newNote, setNewNote] = useState({ title: '', content: '' });
    const [selectedNote, setSelectedNote] = useState<Note | null>(null); // To store the selected note for editing

    useEffect(() => {
        const fetchNotes = async () => {
            const data = await getAllNotes();
            setNotes(data);
        };
        fetchNotes();
    }, []);

    // Handle Delete
    const handleDelete = async (id: string) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "Are you sure to delete this record?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            await deleteNote(id);
            setNotes(notes.filter(note => note.id !== id)); // Remove the deleted note from the list
            Swal.fire('Deleted!', 'The note has been deleted.', 'success');
        }
    };

    // Handle Create
    const handleCreate = async () => {
        await createNote(newNote);
        const updatedNotes = await getAllNotes(); // Refresh the list after creating the note
        setNotes(updatedNotes);
        setShowCreateModal(false); // Close the modal after submission
        Swal.fire('Success!', 'Your note has been created.', 'success');
        setNewNote({ title: '', content: '' }); // Clear form values after submission
    };

    // Handle Update
    const handleUpdate = async () => {
        if (selectedNote) {
            await updateNote(selectedNote); // Call the update API
            const updatedNotes = await getAllNotes(); // Refresh the list after updating the note
            setNotes(updatedNotes);
            setShowEditModal(false); // Close the modal after submission
            Swal.fire('Success!', 'Your note has been updated.', 'success');
        }
    };

    // Handle Input Change for both Create and Edit
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (selectedNote) {
            setSelectedNote(prevNote => prevNote ? { ...prevNote, [name]: value } : null);
        } else {
            setNewNote(prevNote => ({ ...prevNote, [name]: value }));
        }
    };

    // Open Edit Modal and set selected note
    const openEditModal = (note: Note) => {
        setSelectedNote(note);
        setShowEditModal(true);
    };

    // Handle Close Modal for Create and Edit
    const handleCloseModal = () => {
        setShowCreateModal(false);
        setShowEditModal(false);
        setNewNote({ title: '', content: '' }); // Clear form values when modal is closed
        setSelectedNote(null); // Reset selected note
    };

    const data = React.useMemo(() => notes, [notes]);

    const formatDate = (dateString: string) => {
        return moment(dateString).format('LLL');
    };

    const columns: Column<Note>[] = React.useMemo(
        () => [
            {
                Header: 'Title',
                accessor: 'title' as keyof Note,
            },
            {
                Header: 'Content',
                accessor: 'content' as keyof Note,
            },
            {
                Header: 'Create Date',
                accessor: (row) => formatDate(row.createDate)
            },
            {
                Header: 'Last Updated',
                accessor: (row) => row.lastUpdated ? formatDate(row.lastUpdated) : 'N/A'
            },
            {
                Header: 'Actions',
                Cell: ({ row }: any) => (
                    <div className="d-flex">
                        <button
                            className="btn btn-primary me-2"
                            onClick={() => openEditModal(row.original)}
                        >
                            <i className="bi bi-pencil"></i>
                        </button>
                        <button
                            className="btn btn-danger"
                            onClick={() => handleDelete(row.original.id)}
                        >
                            <i className="bi bi-trash"></i>
                        </button>
                    </div>
                )
            }
        ],
        [notes]
    );

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({ columns, data });

    return (
        <div className="container mt-5">
            <div className="card">
                <div className="card-header d-flex justify-content-between align-items-center">
                    <h2>Notes List</h2>
                    <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
                        Create
                    </button>
                </div>
                <div className="card-body">
                    <table className="table table-striped" {...getTableProps()}>
                        <thead>
                            {headerGroups.map(headerGroup => (
                                <tr {...headerGroup.getHeaderGroupProps()}>
                                    {headerGroup.headers.map(column => (
                                        <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody {...getTableBodyProps()}>
                            {rows.map(row => {
                                prepareRow(row);
                                return (
                                    <tr {...row.getRowProps()}>
                                        {row.cells.map(cell => (
                                            <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                        ))}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal for Creating a New Note */}
            <Modal show={showCreateModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Create Note</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                name="title"
                                value={newNote.title}
                                onChange={handleInputChange}
                                placeholder="Enter title"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Content</Form.Label>
                            <Form.Control
                                as="textarea"
                                name="content"
                                value={newNote.content}
                                onChange={handleInputChange}
                                placeholder="Enter content"
                                rows={15}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleCreate}>
                        Submit
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal for Editing an Existing Note */}
            <Modal show={showEditModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Note</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                name="title"
                                value={selectedNote?.title || ''}
                                onChange={handleInputChange}
                                placeholder="Enter title"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Content</Form.Label>
                            <Form.Control
                                as="textarea"
                                name="content"
                                value={selectedNote?.content || ''}
                                onChange={handleInputChange}
                                placeholder="Enter content"
                                rows={15}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleUpdate}>
                        Update
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default Home;