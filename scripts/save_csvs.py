# Script to process Base44 CSV and output JSON
import json
import re

aulas_csv = """observacoes,conteudo_integral,data,status,id,created_date,updated_date,created_by_id,created_by,is_sample
,"true","2026-10-03","Concluída","6ac17c34d41b169bfe299656","2026-10-03T22:05:40.561000","2026-10-03T22:14:37.291000","68f68e0793547539dd457517","treinamentosequalidade@gmail.com","false"
,"true","2026-09-12","Concluída","6aa55418e294f8556609341d","2026-09-12T13:31:04.767000","2026-10-03T22:02:56.602000","68f68e0793547539dd457517","treinamentosequalidade@gmail.com","false"
,"true","2026-09-05","Concluída","6a9c248c1021c607faaada15","2026-09-05T14:17:48.606000","2026-09-12T13:27:58.668000","68f68e0793547539dd457517","treinamentosequalidade@gmail.com","false"
"Raspagem segurando um braço e a queda quando o adversário solta","true","2026-08-22","Concluída","6a89a06b8907ab4db3327e19","2026-08-22T13:13:15.833000","2026-08-29T19:04:18.257000","68f68e0793547539dd457517","treinamentosequalidade@gmail.com","false"
,"true","2026-08-15","Concluída","6a806c13e2683f0c99c09d17","2026-08-15T13:39:31.915000","2026-08-20T20:43:34.739000","68f68e0793547539dd457517","treinamentosequalidade@gmail.com","false"
,"true","2026-08-08","Concluída","6a7732720b13251007bff9a9","2026-08-08T13:43:14.894000","2026-08-15T13:19:51.035000","68f68e0793547539dd457517","treinamentosequalidade@gmail.com","false"
,"true","2026-08-01","Concluída","6a6debe6960465daa2fe350b","2026-08-01T12:51:50.973000","2026-08-08T13:42:39.975000","68f68e0793547539dd457517","treinamentosequalidade@gmail.com","false"
,"true","2026-07-25","Concluída","6a63bdd0e94658eae773a08f","2026-07-24T19:32:32.636000","2026-08-01T12:48:55.738000","68f68e0793547539dd457517","treinamentosequalidade@gmail.com","false"
"Algumas técnicas sem kimono para defesa pessoal de iniciantes.","true","2026-07-18","Concluída","6a5fd0bb4d477dfc685c75e8","2026-07-21T20:04:11.712000","2026-08-01T12:49:20.296000","68f68e0793547539dd457517","treinamentosequalidade@gmail.com","false"
,"true","2026-07-11","Concluída","6a52482f65a3bf9903e664b7","2026-07-11T13:42:07.811000","2026-07-18T13:36:01.126000","68f68e0793547539dd457517","treinamentosequalidade@gmail.com","false"
,"true","2026-07-04","Concluída","6a5245d20f86f2755105f82d","2026-07-11T13:32:02.407000","2026-07-11T13:32:08.821000","68f68e0793547539dd457517","treinamentosequalidade@gmail.com","false"
,"true","2026-06-20","Concluída","6a368df97efb4df061a07f6c","2026-06-20T12:56:25.321000","2026-06-20T16:13:42.094000","68f68e0793547539dd457517","treinamentosequalidade@gmail.com","false"
,"true","2026-05-30","Concluída","6a1ae1c05d466f6908001470","2026-05-30T13:10:24.282000","2026-06-16T12:11:15.750000","68f68e0793547539dd457517","treinamentosequalidade@gmail.com","false"
,"true","2026-05-09","Concluída","69ff30f9a64ed50d6bc6b3d6","2026-05-09T13:04:57.747000","2026-06-16T12:11:11.605000","68f68e0793547539dd457517","treinamentosequalidade@gmail.com","false"
"Faltou o paper cut choke","false","2026-04-18","Concluída","69e37b8fe0a1feaa42b5887f","2026-04-18T12:39:43.801000","2026-04-22T15:03:32.729000","68f68e0793547539dd457517","treinamentosequalidade@gmail.com","false"
,"false","2026-04-04","Concluída","69d0fd89d7fa9b7c50a9817b","2026-04-04T12:01:13.310000","2026-04-18T12:39:14.001000","68f68e0793547539dd457517","treinamentosequalidade@gmail.com","false"
"'+finalização do baldinho","true","2026-03-28","Concluída","69c84cbeb90eda63b64889ec","2026-03-28T21:48:46.633000","2026-03-28T21:49:21.060000","68f68e0793547539dd457517","treinamentosequalidade@gmail.com","false"
"Para no gi, o estrangulamento rodado é o baseball choke. ","true","2026-03-21","Concluída","69be8b799a25f36209d993a1","2026-03-21T12:13:45.880000","2026-03-23T18:48:10.302000","68f68e0793547539dd457517","treinamentosequalidade@gmail.com","false"
,"true","2026-03-14","Concluída","69b599f2c55be8fc2106cdd2","2026-03-14T17:25:06.141000","2026-03-21T13:04:33.445000","68f68e0793547539dd457517","treinamentosequalidade@gmail.com","false"
"Osoto gari, morote seoi nage e ouchi gari. Raspagem do pêndulo partindo da guarda fechada. Estrangulamento rodado partindo do 100kg transicionando pro joelho na barriga e estrangulando. ","true","2025-11-22","Concluída","6922a6ca61374baf38ee5199","2025-11-23T06:16:42.166000","2025-11-23T06:16:53.162000","68f68e0793547539dd457517","treinamentosequalidade@gmail.com","false"
"Kimura do 4 apoios abraçado por cima saindo pela lateral \nDefesa do triângulo com joelho no cóccix \n","true","2025-10-25","Concluída","68fd0a17824be991007940f4","2025-10-25T17:34:15.736000","2025-11-01T20:59:59.983000","68f68e0793547539dd457517","treinamentosequalidade@gmail.com","false"
"""

with open('/tmp/aulas.csv', 'w') as f:
    f.write(aulas_csv)
print("Aulas saved")
