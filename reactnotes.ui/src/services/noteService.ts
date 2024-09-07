import axios from 'axios';

const API_URL = 'http://localhost:8080/api/note'; // Replace with your API URL

export interface Note {
    id: string;
    title: string;
    content: string;
    createDate: string;
    lastUpdated: string;
}

export interface CreateNoteRequestModel {
    title: string;
    content: string;
}

export interface UpdateNoteRequestModel {
    id: string;
    title: string;
    content: string;
}

export interface DeleteNoteRequestModel {
    id: string;
}

export const getAllNotes = async (): Promise<Note[]> => {
    try {
        const response = await axios.get<Note[]>(API_URL);
        return response.data;
    } catch (e) {
        console.log(e);
    }
    // create a variable for Note Array.
    // create array of Note.
    let data: Note[];
    // eslint-disable-next-line prefer-const
    data = [];

    return data;
};

export const getNote = async (id: string): Promise<Note> => {
    const response = await axios.get<Note>(`${API_URL}/${id}`);
    return response.data;
};

export const createNote = async (note: CreateNoteRequestModel): Promise<void> => {
    await axios.post(API_URL, note);
};

export const updateNote = async (note: UpdateNoteRequestModel): Promise<void> => {
    await axios.put(`${API_URL}`, note);
};

export const deleteNote = async (id: string): Promise<void> => {
    await axios.delete(`${API_URL}`, { data: { id } });
};
