<i18n src="./data-import-lang.json"></i18n>
<template>
    <div class="main-text-data-import">
        <div class="firstTitle">{{ $t('t1') }}</div>
        <!-- <div class="video-btn" @click="changeVideoStatus('hidden')">收起视频</div>
        <div class="video-btn" @click="changeVideoStatus('hidden')">展开视频</div> -->
        <!-- <video src="@/assets/help/ImportData.mp4" preload controls="controls"></video> -->
        <section>
            {{ $t('t2') }}
        </section>
        <section>
            {{ $t('t3') }}
        </section>
        <section>
            {{ $t('t4') }}
        </section>
        <section class="lastSection importData">
            {{ $t('t5') }}
        </section>
        <div>
            <span style="font-size:12px">{{ $t('t6') }}<sup>1</sup></span> :
        </div>
        <section class="movie-files">
            <table>
                <tr>
                    <td>{{ $t('t7') }}：</td>
                    <td>
                        <a :href="baseUrl + 'movie_files/person_node.csv'">Person.csv</a>
                    </td>
                    <td>
                        <a :href="baseUrl + 'movie_files/movie_node.csv'">Movie.csv</a>
                    </td>
                    <td>
                        <a :href="baseUrl + 'movie_files/genre_node.csv'">Genre.csv</a>
                    </td>
                    <td>
                        <a :href="baseUrl + 'movie_files/user_node.csv'">User.csv</a>
                    </td>
                    <td>
                        <a :href="baseUrl + 'movie_files/keyword_node.csv'">Keyword.csv</a>
                    </td>
                </tr>
                <tr>
                    <td>{{ $t('t8') }}：</td>
                    <td>
                        <a :href="baseUrl + 'movie_files/acted_in_rels.csv'">ACTED_IN.csv</a>
                    </td>
                    <td>
                        <a :href="baseUrl + 'movie_files/friends_rel.csv'">FRIENDS.csv</a>
                    </td>
                    <td>
                        <a :href="baseUrl + 'movie_files/directed_rels.csv'">DIRECTED.csv</a>
                    </td>
                    <td>
                        <a :href="baseUrl + 'movie_files/has_genre_rels.csv'">HAS_GENRE.csv</a>
                    </td>
                    <td>
                        <a :href="baseUrl + 'movie_files/has_keyword_rels.csv'">HAS_KEYWORD.csv</a>
                    </td>
                </tr>
                <tr>
                    <td></td>
                    <td>
                        <a :href="baseUrl + 'movie_files/produced_rels.csv'">PRODUCED.csv</a>
                    </td>
                    <td>
                        <a :href="baseUrl + 'movie_files/ratings.csv'">RATINGS.csv</a>
                    </td>
                    <td>
                        <a :href="baseUrl + 'movie_files/writer_of_rels.csv'">WRITER_OF.csv</a>
                    </td>
                </tr>
            </table>
        </section>
        <section style="margin-bottom:60px">
            <hr />
            <span style="font-size:12px"><sup>1</sup>&nbsp;&nbsp; {{ $t('t9') }}：</span
            ><a href="http://www.mpi-inf.mpg.de/departments/databases-and-information-systems/research/yago-naga/yago/" target="_blank"
                >http://www.mpi-inf.mpg.de/departments/databases-and-information-systems/research/yago-naga/yago/</a
            >
        </section>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { component } from 'vue/types/umd'
const baseUrl: string = process.env.BASE_URL
@Component
export default class ImportData extends Vue {
    baseUrl: string = baseUrl
}
</script>

<style lang="less" scope>
.main-text-data-import {
    font-family: MicrosoftYaHei;
    font-size: 14px;
    color: #052c57;
    line-height: 28px;
    .firstTitle {
        margin-top: 55px;
        margin-bottom: 40px;
        font-family: MicrosoftYaHei-Bold;
        font-size: 32px;
        color: #052c57;
    }
    .secondTitle {
        margin-bottom: 12px;
        font-family: MicrosoftYaHei-Bold;
        font-size: 18px;
        color: #052c57;
        line-height: 28px;
    }
    .createButton {
        width: 250px;
        height: 40px;
        margin-bottom: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        background: #3e8cf6;
        border-radius: 20px;
        border-radius: 20px;
        font-family: MicrosoftYaHei-Bold;
        font-size: 14px;
        color: #ffffff;
        cursor: pointer;
    }
    .createButton:hover {
        background: #2a70cf;
        border-radius: 20px;
        border-radius: 20px;
    }
    video {
        width: 100%;
        margin-bottom: 20px;
    }
    .movie-files {
        display: flex;
        flex-wrap: wrap;
        table {
            width: 100%;
            td {
                min-width: 86px;
            }
        }
        a {
            cursor: pointer;
            color: #052c57;
            &:hover {
                color: #3681f4;
            }
        }
    }
}
</style>
