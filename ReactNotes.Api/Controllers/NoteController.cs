using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using ReactNotes.Api.Models.Request;
using ReactNotes.Application.Repositories.Abstraction;
using ReactNotes.Domain;

namespace ReactNotes.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NoteController(INoteRepository noteRepository, IMapper mapper) : ControllerBase
    {
        [HttpGet]
        public IActionResult GetAllNotes()
        {
            var notes = noteRepository.GetAllNotes();
            return Ok(notes);
        }

        [HttpGet("{id}")]
        public IActionResult GetNoteById(Guid id)
        {
            var note = noteRepository.GetNoteById(id);
            if (note == null)
            {
                return NotFound();
            }
            return Ok(note);
        }

        [HttpPost]
        public IActionResult Create(CreateNoteRequestModel model)
        {
            var mappingModel = mapper.Map<CreateNoteRequestModel, Note>(model);

            var newNote = noteRepository.Create(mappingModel);
            return CreatedAtAction(nameof(GetNoteById), new { id = newNote.Id }, newNote);
        }

        [HttpPut("{id}")]
        public IActionResult Update(UpdateNoteRequestModel model)
        {
            var mappingModel = mapper.Map<UpdateNoteRequestModel, Note>(model);

            var updatedNote = noteRepository.Update(mappingModel);
            if (updatedNote == null)
            {
                return NotFound();
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(DeleteNoteRequestModel model)
        {
            noteRepository.Delete(model.Id);
            return NoContent();
        }
    }
}
