# 콘텐츠 검수 및 영문 번역 기록

검수일: 2026-11-06. 공개 글 11편, 초안 1편과 소개 페이지를 검수했습니다. 공개 글 11편과 소개 페이지에 영문판을 추가했으며, 초안의 영문판은 비공개 상태로 유지했습니다.

| 대상 | 반영 사항 |
| --- | --- |
| Discord 봇 0 | 근거 없는 봇 개수·언어 인기 단정 완화, self-bot 안내 수정, `discord.py` 버전 오기 표시 |
| Discord 봇 1 | 필요한 권한·인텐트 안내, 토큰의 의미, 문장과 오탈자 수정 |
| Discord 봇 2 | 짧은 Bot 생성 예제에 필수 `intents` 추가, 명령어 접두사 설명 수정 |
| Discord 봇 3 | 채널 ID 자리표시자를 실행 가능한 숫자 예제로 교체, 멤버 인텐트·DM 예외·채널 조회 실패 설명 보강 |
| Discord 봇 4 | `setup_hook` 오탈자·역할 설명, 중복 부정, 공통 처리 함수 재사용 설명 수정 |
| Discord 봇 5 | Embed 필수 인자 오해, 불필요한 `discord-ui` 설치 안내, 일반/ephemeral View의 시간 제한 구분, 닫히지 않은 select 예제 수정 |
| Discord 봇 6 | Cog와 extension 구분, `app_commands` 오탈자, 효과 없는 코드 한 줄 제거, 중복 로딩 설명 보강 |
| Discord 봇 7 | 잘못된 `pip install sqlite3` 제거, 커서·패키지 import 설명, 매개변수 바인딩 설명과 SQLite의 `INSERT OR IGNORE` 구문 수정 |
| UI/UX 0 | UI를 시각 요소로만 한정하는 설명 보완, UX 범위와 결정 시간 관련 단정 완화, 참고 자료 추가 |
| Unity 0 | 중간에 끝난 에디터 설치·프로젝트 생성 절차 보완, 라이선스 자격의 공식 안내 연결, 표현과 표기 수정 |
| GDC 의미 있는 선택 | 글 구조·가상 사례와 출처의 구분 검수, 영문판 제공. 영상 전체를 검증했다는 표현은 추가하지 않음 |
| UI/UX 1 초안 | Nielsen 표기·원문 출처 수정, 깨진 인용 마커와 이미지 자리표시자 제거, 과도한 일반화 완화. 공개하지 않음 |

모든 글의 `+/-TTTT` 시간대 자리표시자를 `+0900`으로 정리하고, 이미지 경로의 공백을 인코딩했으며, 이미지에 절별 맥락을 담은 대체 텍스트를 추가했습니다. 원문의 URL·카테고리와 게시 날짜의 실제 값은 유지했습니다. 코드 예제는 검수한 한국어·영문판에서 동일합니다.

## 검증

- Jekyll 빌드 통과.
- 한국어·영어 26개 페이지의 내부 링크, 이미지 경로, 앵커, 언어 쌍, 번역 키, 코드 일치 및 초안 제외 검사 통과.
- 전체 코드 부록의 Python 코드 블록 14개 구문 검사 통과.
- 브라우저에서 홈·글 목록의 양국어 전환, 영어 검색, 주제 필터, 검색 조건 유지, 동일 글 양방향 전환 및 새로고침 확인.
- 390px 모바일 화면에서 언어 버튼과 메뉴 배치·펼치기 확인.
- HTMLProofer는 로컬 Windows 환경의 `libcurl` 누락으로 실행되지 않아 위 내부 링크 검사로 보완했습니다. CI의 기존 HTMLProofer 단계는 유지했습니다.

## 검수의 범위와 남은 한계

- 문장·표기·구조 및 확인한 기술 설명을 검수했습니다. 실제 Discord 봇 실행, Discord 포털 전체 절차, Unity 설치를 재현한 검증은 아닙니다.
- 기존 화면 캡처는 과거 UI를 보여 줍니다. 영어 글의 설명·표·제목·대체 텍스트는 번역했으며, 스크린샷과 코드 안의 한국어 명령어·메시지·주석은 원문과의 대응을 위해 유지했습니다.
- 2024년에 사용한 `discord.py`의 정확한 패치 버전은 자료만으로 확인할 수 없어 임의로 새 버전을 기입하지 않았습니다.
- 모든 외부 링크의 가용성, 모든 외부 이미지의 이용 허가, GDC 영상 전체의 세부 발언까지 검증한 것은 아닙니다. 기존 출처·인용 범위 설명은 유지했습니다.
- 소스와 로컬 빌드를 수정했습니다. GitHub Pages로의 push·배포는 실행하지 않았습니다.

## 주요 확인 자료

- [discord.py 인텐트 안내](https://discordpy.readthedocs.io/en/stable/intents.html)
- [discord.py Cog 문서](https://discordpy.readthedocs.io/en/stable/ext/commands/cogs.html)
- [discord.py View API](https://discordpy.readthedocs.io/en/stable/interactions/api.html#discord.ui.View)
- [Python 3.12 sqlite3](https://docs.python.org/3.12/library/sqlite3.html)
- [SQLite ON CONFLICT](https://sqlite.org/lang_conflict.html)
- [Unity Hub](https://docs.unity.com/en-us/hub), [Unity Personal](https://unity.com/products/unity-personal)
- [Jakob Nielsen: End of Web Design](https://www.nngroup.com/articles/end-of-web-design/)
- [Matthias Worch: Decisions That Matter](https://www.worch.com/2014/03/23/decisions-that-matter/)
