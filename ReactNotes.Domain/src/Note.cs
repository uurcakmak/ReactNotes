using System.ComponentModel.DataAnnotations;

namespace ReactNotes.Domain
{
    public class Note
    {
        [Key]
        public Guid Id { get; set; }

        public required string Title { get; set; }

        public required string Content { get; set; }

        public DateTime CreateDate { get; set; } = DateTime.UtcNow;

        public DateTime? LastUpdated { get; set; }
    }
}
