using System.ComponentModel.DataAnnotations;

namespace ReactNotes.Api.Models.Request
{
    public class UpdateNoteRequestModel
    {
        [Required]
        public Guid Id { get; set; }

        [Required]
        public string Title { get; set; }

        [Required]
        public string Content { get; set; }
    }
}
