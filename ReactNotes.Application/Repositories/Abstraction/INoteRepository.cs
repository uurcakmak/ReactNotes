using ReactNotes.Domain;

namespace ReactNotes.Application.Repositories.Abstraction;
public interface INoteRepository
{
    IEnumerable<Note> GetAllNotes();

    Note GetNoteById(Guid id);

    Note Create(Note note);

    Note Update(Note note);

    void Delete(Guid id);
}