import React, { useEffect, useState } from 'react';
import { useTable, Column } from 'react-table';
import Swal from 'sweetalert2';
import { Modal, Button, Form } from 'react-bootstrap';
import { getAllNotes, createNote, deleteNote, Note } from './../../services/noteService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

const Home: React.FC = () => {
    const [notes, setNotes] = useState<Note[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [newNote, setNewNote] = useState({ title: '', content: '' });

    useEffect(() => {
        const fetchNotes = async () => {
            const data = await getAllNotes();
            setNotes(data);
        };
        fetchNotes();
    }, []);


    const handleCreate = async () => {
        await createNote(newNote);
        const updatedNotes = await getAllNotes(); 
        setNotes(updatedNotes);
        setShowModal(false);
        Swal.fire('Success!', 'Your note has been created.', 'success');
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewNote(prevNote => ({ ...prevNote, [name]: value }));
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setNewNote({ title: '', content: '' });
    };

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
            setNotes(notes.filter(note => note.id !== id));  // Remove the deleted note from the list
            Swal.fire('Deleted!', 'The note has been deleted.', 'success');
        }
    };

    const data = React.useMemo(() => notes, [notes]);

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
                accessor: 'createDate' as keyof Note,
            },
            {
                Header: 'Last Updated',
                accessor: 'lastUpdated' as keyof Note,
            },
            {
                Header: 'Actions',
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                Cell: ({ row }: any) => {
                    return (
                        <button
                            className="btn btn-danger"
                            onClick={() => handleDelete(row.original.id)}
                        >
                            <FontAwesomeIcon icon={faTrash} />
                        </button>
                    );
                }
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
                <div className="card-header bg-primary text-white pt-3 d-flex justify-content-between align-items-center">
                    <h2>Notes List</h2>
                    <button className="btn btn-success" onClick={() => setShowModal(true)}>
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
            <Modal show={showModal} onHide={handleCloseModal}>
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
                                rows={5}
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
        </div>
    );
};

export default Home;