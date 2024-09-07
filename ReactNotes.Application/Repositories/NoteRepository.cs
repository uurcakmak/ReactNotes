using ReactNotes.Application.DBContext;
using ReactNotes.Application.Repositories.Abstraction;
using ReactNotes.Domain;

namespace ReactNotes.Application.Repositories;

public class NoteRepository : INoteRepository
{
    
    private readonly NoteDbContext _context;

    public NoteRepository(NoteDbContext context)
    {
        _context = context;
    }

    public IEnumerable<Note> GetAllNotes() => _context.Notes.ToList();

    public Note GetNoteById(Guid id) => _context.Notes.Find(id);

    public Note Create(Note note)
    {
        note.Id = Guid.NewGuid();
        note.CreateDate = DateTime.UtcNow;
        note.LastUpdated = null;
        _context.Notes.Add(note);
        _context.SaveChanges();
        return note;
    }

    public Note Update(Note note)
    {
        var existingNote = _context.Notes.Find(note.Id);
        if (existingNote == null) return null;

        existingNote.Title = note.Title;
        existingNote.Content = note.Content;
        existingNote.LastUpdated = DateTime.UtcNow;
        _context.SaveChanges();
        return existingNote;
    }

    public void Delete(Guid id)
    {
        var note = _context.Notes.Find(id);
        if (note != null)
        {
            _context.Notes.Remove(note);
            _context.SaveChanges();
        }
    }
}