import React, { useEffect, useState } from 'react';
import { useTable, Column } from 'react-table';
import { getAllNotes, Note } from './../../services/noteService';
import 'bootstrap/dist/css/bootstrap.min.css'; // Make sure Bootstrap is imported

const Home: React.FC = () => {
    const [notes, setNotes] = useState<Note[]>([]);

    useEffect(() => {
        const fetchNotes = async () => {
            const data = await getAllNotes();
            setNotes(data);
        };
        fetchNotes();
    }, []);

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
        ],
        []
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
                <div className="card-header bg-primary text-white pt-3">
                    <h2>Notes List</h2>
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
        </div>
    );
};

export default Home;