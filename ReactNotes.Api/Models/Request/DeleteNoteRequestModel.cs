using System.ComponentModel.DataAnnotations;

namespace ReactNotes.Api.Models.Request
{
    public class DeleteNoteRequestModel
    {
        [Required]
        public Guid Id { get; set; }
    }
}
