using System.ComponentModel.DataAnnotations;

namespace ReactNotes.Api.Models.Request
{
    public class CreateNoteRequestModel
    {
        [Required]
        public string Title { get; set; }

        [Required]
        public string Content { get; set; }
    }
}
