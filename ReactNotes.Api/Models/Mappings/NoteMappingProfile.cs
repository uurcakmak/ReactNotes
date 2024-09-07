using AutoMapper;
using ReactNotes.Api.Models.Request;
using ReactNotes.Domain;

namespace ReactNotes.Api.Models.Mappings
{
    public class NoteMappingProfile : Profile
    {
        public NoteMappingProfile()
        {
            CreateMap<CreateNoteRequestModel, Note>().ReverseMap();
            CreateMap<UpdateNoteRequestModel, Note>().ReverseMap();
            CreateMap<DeleteNoteRequestModel, Note>().ReverseMap();
        }
    }
}
